import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Eye, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  Calculator,
  Target,
  Crosshair,
  Ruler,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Schema completo para medições ópticas profissionais
const measurementSchema = z.object({
  measurement_type: z.enum(["prescription", "fitting", "progressive"]),
  
  // Olho Direito (OD)
  od_sphere: z.number().min(-30).max(30).optional(),
  od_cylinder: z.number().min(-10).max(10).optional(),
  od_axis: z.number().min(0).max(180).optional(),
  od_prism: z.number().min(0).max(20).optional(),
  od_prism_base: z.enum(["UP", "DOWN", "IN", "OUT"]).optional(),
  od_add: z.number().min(0).max(4).optional(),
  od_visual_acuity: z.string().optional(),
  
  // Olho Esquerdo (OS)
  os_sphere: z.number().min(-30).max(30).optional(),
  os_cylinder: z.number().min(-10).max(10).optional(),
  os_axis: z.number().min(0).max(180).optional(),
  os_prism: z.number().min(0).max(20).optional(),
  os_prism_base: z.enum(["UP", "DOWN", "IN", "OUT"]).optional(),
  os_add: z.number().min(0).max(4).optional(),
  os_visual_acuity: z.string().optional(),
  
  // Distâncias Pupilares
  pupillary_distance: z.number().min(40).max(80).optional(),
  dpn_od: z.number().min(20).max(40).optional(),
  dpn_os: z.number().min(20).max(40).optional(),
  pd_near: z.number().min(40).max(75).optional(),
  pd_far: z.number().min(45).max(80).optional(),
  
  // Centro Óptico
  optical_center_od_x: z.number().min(-30).max(30).optional(),
  optical_center_od_y: z.number().min(-30).max(30).optional(),
  optical_center_os_x: z.number().min(-30).max(30).optional(),
  optical_center_os_y: z.number().min(-30).max(30).optional(),
  
  // Lentes Progressivas
  fitting_height_od: z.number().min(10).max(30).optional(),
  fitting_height_os: z.number().min(10).max(30).optional(),
  pantoscopic_tilt: z.number().min(-15).max(15).optional(),
  face_form_angle: z.number().min(-15).max(15).optional(),
  vertex_distance: z.number().min(8).max(20).optional(),
  
  // Especificações
  frame_type: z.enum(["full_rim", "semi_rimless", "rimless"]).optional(),
  lens_type: z.enum(["single_vision", "bifocal", "progressive", "occupational"]),
  coating_type: z.enum(["anti_reflective", "blue_light", "photochromic", "polarized"]).optional(),
  frame_size: z.string().optional(),
  bridge_size: z.number().min(10).max(25).optional(),
  temple_length: z.number().min(120).max(160).optional(),
  
  // Biometria
  corneal_curvature_od_k1: z.number().min(35).max(50).optional(),
  corneal_curvature_od_k2: z.number().min(35).max(50).optional(),
  corneal_curvature_os_k1: z.number().min(35).max(50).optional(),
  corneal_curvature_os_k2: z.number().min(35).max(50).optional(),
  
  // Profissional
  measured_by: z.string().min(1, "Nome do profissional é obrigatório"),
  equipment_used: z.string().optional(),
  measurement_conditions: z.string().optional(),
  notes: z.string().optional(),
});

type MeasurementFormData = z.infer<typeof measurementSchema>;

interface OpticalMeasurement {
  id: number;
  measurement_type: string;
  od_sphere?: number;
  od_cylinder?: number;
  od_axis?: number;
  os_sphere?: number;
  os_cylinder?: number;
  os_axis?: number;
  pupillary_distance?: number;
  dpn_od?: number;
  dpn_os?: number;
  optical_center_od_x?: number;
  optical_center_od_y?: number;
  optical_center_os_x?: number;
  optical_center_os_y?: number;
  lens_type: string;
  measured_by: string;
  prescription_status: string;
  measured_at: string;
  notes?: string;
}

export default function OpticalMeasurements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMeasurement, setEditingMeasurement] = useState<OpticalMeasurement | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar medições do usuário
  const { data: measurements = [], isLoading } = useQuery({
    queryKey: ["/api/measurements", user?.id],
    queryFn: async () => {
      const res = await apiRequest(`/api/measurements?userId=${user?.id}`);
      return await res.json();
    },
    enabled: !!user?.id,
  });

  // Mutations para CRUD
  const createMutation = useMutation({
    mutationFn: async (data: MeasurementFormData) => {
      const measurementData = {
        ...data,
        user_id: user?.id,
        measured_at: new Date().toISOString(),
      };
      const res = await apiRequest("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(measurementData),
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/measurements"] });
      setIsAddDialogOpen(false);
      addForm.reset();
      toast({
        title: "Sucesso",
        description: "Medição registrada com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao registrar medição",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<MeasurementFormData> }) => {
      const res = await apiRequest(`/api/measurements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/measurements"] });
      setIsEditDialogOpen(false);
      setEditingMeasurement(null);
      editForm.reset();
      toast({
        title: "Sucesso",
        description: "Medição atualizada com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar medição",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/measurements/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/measurements"] });
      toast({
        title: "Sucesso",
        description: "Medição excluída com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao excluir medição",
        variant: "destructive",
      });
    },
  });

  const addForm = useForm<MeasurementFormData>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      measurement_type: "prescription",
      lens_type: "single_vision",
      measured_by: "",
    },
  });

  const editForm = useForm<MeasurementFormData>({
    resolver: zodResolver(measurementSchema),
  });

  // Filtrar medições
  const filteredMeasurements = measurements.filter((measurement: OpticalMeasurement) => {
    const matchesSearch = searchTerm === "" || 
      measurement.measured_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
      measurement.lens_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || measurement.measurement_type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const handleAdd = (data: MeasurementFormData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (data: MeasurementFormData) => {
    if (editingMeasurement) {
      updateMutation.mutate({ id: editingMeasurement.id, data });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta medição?")) {
      deleteMutation.mutate(id);
    }
  };

  const openEditDialog = (measurement: OpticalMeasurement) => {
    setEditingMeasurement(measurement);
    editForm.reset({
      measurement_type: measurement.measurement_type as any,
      od_sphere: measurement.od_sphere,
      od_cylinder: measurement.od_cylinder,
      od_axis: measurement.od_axis,
      os_sphere: measurement.os_sphere,
      os_cylinder: measurement.os_cylinder,
      os_axis: measurement.os_axis,
      pupillary_distance: measurement.pupillary_distance,
      dpn_od: measurement.dpn_od,
      dpn_os: measurement.dpn_os,
      optical_center_od_x: measurement.optical_center_od_x,
      optical_center_od_y: measurement.optical_center_od_y,
      optical_center_os_x: measurement.optical_center_os_x,
      optical_center_os_y: measurement.optical_center_os_y,
      lens_type: measurement.lens_type as any,
      measured_by: measurement.measured_by,
      notes: measurement.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const formatPrescription = (sphere?: number, cylinder?: number, axis?: number) => {
    if (!sphere && !cylinder) return "-";
    let prescription = "";
    if (sphere) prescription += `${sphere > 0 ? '+' : ''}${sphere.toFixed(2)}`;
    if (cylinder) prescription += ` ${cylinder > 0 ? '+' : ''}${cylinder.toFixed(2)}`;
    if (axis && cylinder) prescription += ` x ${axis}°`;
    return prescription;
  };

  const calculateDPN = (pd: number) => {
    // Cálculo aproximado: DPN = PD/2
    return (pd / 2).toFixed(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'replaced': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userType="client" />
      <Header />
      <MobileNav activeItem="measurement" />
      
      <div className="lg:ml-64 pt-16">
        <div className="p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Medições Ópticas</h2>
                <p className="text-gray-600">Sistema profissional de medições oftalmológicas</p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setCalculatorOpen(true)}
                  className="gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Calculadora DPN
                </Button>
                
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Medição
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Nova Medição Óptica Profissional
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...addForm}>
                      <form onSubmit={addForm.handleSubmit(handleAdd)} className="space-y-6">
                        <Tabs defaultValue="basic" className="w-full">
                          <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="basic">Básico</TabsTrigger>
                            <TabsTrigger value="prescription">Receita</TabsTrigger>
                            <TabsTrigger value="pupillary">DPN & Centro</TabsTrigger>
                            <TabsTrigger value="progressive">Progressiva</TabsTrigger>
                            <TabsTrigger value="specs">Especificações</TabsTrigger>
                          </TabsList>

                          {/* Aba Básica */}
                          <TabsContent value="basic" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={addForm.control}
                                name="measurement_type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tipo de Medição</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="prescription">Receita Oftalmológica</SelectItem>
                                        <SelectItem value="fitting">Medição para Montagem</SelectItem>
                                        <SelectItem value="progressive">Lente Progressiva</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={addForm.control}
                                name="lens_type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tipo de Lente</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione o tipo de lente" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="single_vision">Monofocal</SelectItem>
                                        <SelectItem value="bifocal">Bifocal</SelectItem>
                                        <SelectItem value="progressive">Progressiva</SelectItem>
                                        <SelectItem value="occupational">Ocupacional</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={addForm.control}
                              name="measured_by"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Profissional Responsável</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Nome do optometrista/oftalmologista" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={addForm.control}
                              name="equipment_used"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Equipamento Utilizado</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: Autorefrator Topcon, Lensômetro Zeiss..." />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TabsContent>

                          {/* Aba Receita */}
                          <TabsContent value="prescription" className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                              {/* Olho Direito */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-sm">Olho Direito (OD)</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="grid grid-cols-3 gap-2">
                                    <FormField
                                      control={addForm.control}
                                      name="od_sphere"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-xs">Esférico</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.25"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="0.00"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={addForm.control}
                                      name="od_cylinder"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-xs">Cilíndrico</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.25"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="0.00"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={addForm.control}
                                      name="od_axis"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-xs">Eixo</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number"
                                              {...field}
                                              onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                              placeholder="0°"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                      control={addForm.control}
                                      name="od_add"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-xs">Adição</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.25"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="0.00"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={addForm.control}
                                      name="od_visual_acuity"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-xs">AV</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="20/20" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Olho Esquerdo */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-sm">Olho Esquerdo (OS)</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="grid grid-cols-3 gap-2">
                                    <FormField
                                      control={addForm.control}
                                      name="os_sphere"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-xs">Esférico</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.25"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="0.00"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={addForm.control}
                                      name="os_cylinder"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-xs">Cilíndrico</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.25"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="0.00"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={addForm.control}
                                      name="os_axis"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-xs">Eixo</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number"
                                              {...field}
                                              onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                              placeholder="0°"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                      control={addForm.control}
                                      name="os_add"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-xs">Adição</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.25"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="0.00"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={addForm.control}
                                      name="os_visual_acuity"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-xs">AV</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="20/20" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>

                          {/* Aba DPN & Centro Óptico */}
                          <TabsContent value="pupillary" className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-sm flex items-center gap-2">
                                    <Ruler className="h-4 w-4" />
                                    Distâncias Pupilares
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <FormField
                                    control={addForm.control}
                                    name="pupillary_distance"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>DP Total (mm)</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="0.5"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                            placeholder="65.0"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                      control={addForm.control}
                                      name="dpn_od"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>DPN OD</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.5"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="32.5"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={addForm.control}
                                      name="dpn_os"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>DPN OS</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.5"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="32.5"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                      control={addForm.control}
                                      name="pd_far"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>DP Longe</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.5"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="65.0"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={addForm.control}
                                      name="pd_near"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>DP Perto</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.5"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="62.0"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-sm flex items-center gap-2">
                                    <Crosshair className="h-4 w-4" />
                                    Centro Óptico (mm)
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="text-sm text-gray-600 mb-3">
                                    Coordenadas do centro óptico relativo ao centro geométrico da lente
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                      control={addForm.control}
                                      name="optical_center_od_x"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>OD X (horizontal)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.1"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="0.0"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={addForm.control}
                                      name="optical_center_od_y"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>OD Y (vertical)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.1"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="0.0"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                      control={addForm.control}
                                      name="optical_center_os_x"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>OS X (horizontal)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.1"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="0.0"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={addForm.control}
                                      name="optical_center_os_y"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>OS Y (vertical)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.1"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="0.0"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>

                          {/* Aba Progressiva */}
                          <TabsContent value="progressive" className="space-y-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm">Medições para Lentes Progressivas</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={addForm.control}
                                    name="fitting_height_od"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Altura de Montagem OD (mm)</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="0.5"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                            placeholder="20.0"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={addForm.control}
                                    name="fitting_height_os"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Altura de Montagem OS (mm)</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="0.5"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                            placeholder="20.0"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                  <FormField
                                    control={addForm.control}
                                    name="pantoscopic_tilt"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Inclinação Pantoscópica (°)</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="1"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                            placeholder="8"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={addForm.control}
                                    name="face_form_angle"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Ângulo Facial (°)</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="1"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                            placeholder="5"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={addForm.control}
                                    name="vertex_distance"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Distância Vértex (mm)</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="0.5"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                            placeholder="12.0"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>

                          {/* Aba Especificações */}
                          <TabsContent value="specs" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={addForm.control}
                                name="frame_type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tipo de Armação</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="full_rim">Aro Fechado</SelectItem>
                                        <SelectItem value="semi_rimless">Semi Aro</SelectItem>
                                        <SelectItem value="rimless">Sem Aro</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={addForm.control}
                                name="coating_type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tipo de Tratamento</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione o tratamento" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="anti_reflective">Antirreflexo</SelectItem>
                                        <SelectItem value="blue_light">Filtro Luz Azul</SelectItem>
                                        <SelectItem value="photochromic">Fotossensível</SelectItem>
                                        <SelectItem value="polarized">Polarizado</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={addForm.control}
                              name="notes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Observações</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      {...field} 
                                      placeholder="Observações adicionais sobre a medição..."
                                      rows={4}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </TabsContent>
                        </Tabs>

                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={createMutation.isPending}
                        >
                          {createMutation.isPending ? "Registrando..." : "Registrar Medição"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Medições</CardTitle>
                  <Eye className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{measurements.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Registros no sistema
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Medições Ativas</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {measurements.filter((m: OpticalMeasurement) => m.prescription_status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receitas válidas
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Última Medição</CardTitle>
                  <Target className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {measurements.length > 0 ? 
                      format(new Date(measurements[0]?.measured_at), 'dd/MM') : 
                      '--'
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Data da última
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progressivas</CardTitle>
                  <Crosshair className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {measurements.filter((m: OpticalMeasurement) => m.lens_type === 'progressive').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lentes progressivas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Pesquisar medições..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="prescription">Receita</SelectItem>
                  <SelectItem value="fitting">Montagem</SelectItem>
                  <SelectItem value="progressive">Progressiva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Measurements List */}
            <div className="grid grid-cols-1 gap-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando medições...</p>
                </div>
              ) : filteredMeasurements.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma medição encontrada</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Adicione sua primeira medição óptica para começar
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredMeasurements.map((measurement: OpticalMeasurement, index: number) => (
                  <motion.div
                    key={measurement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Eye className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold capitalize">
                                  {measurement.measurement_type.replace('_', ' ')}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {format(new Date(measurement.measured_at), 'dd/MM/yyyy HH:mm')}
                                </p>
                              </div>
                              <Badge 
                                variant="secondary" 
                                className={getStatusColor(measurement.prescription_status)}
                              >
                                {measurement.prescription_status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Receita</h4>
                                <div className="space-y-1">
                                  <div className="text-sm">
                                    <span className="font-medium">OD:</span> {formatPrescription(measurement.od_sphere, measurement.od_cylinder, measurement.od_axis)}
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-medium">OS:</span> {formatPrescription(measurement.os_sphere, measurement.os_cylinder, measurement.os_axis)}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Distâncias Pupilares</h4>
                                <div className="space-y-1">
                                  {measurement.pupillary_distance && (
                                    <div className="text-sm">
                                      <span className="font-medium">DP:</span> {measurement.pupillary_distance}mm
                                    </div>
                                  )}
                                  {measurement.dpn_od && measurement.dpn_os && (
                                    <div className="text-sm">
                                      <span className="font-medium">DPN:</span> {measurement.dpn_od}/{measurement.dpn_os}mm
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Centro Óptico</h4>
                                <div className="space-y-1">
                                  {measurement.optical_center_od_x !== undefined && (
                                    <div className="text-sm">
                                      <span className="font-medium">OD:</span> X:{measurement.optical_center_od_x} Y:{measurement.optical_center_od_y}
                                    </div>
                                  )}
                                  {measurement.optical_center_os_x !== undefined && (
                                    <div className="text-sm">
                                      <span className="font-medium">OS:</span> X:{measurement.optical_center_os_x} Y:{measurement.optical_center_os_y}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span>{measurement.lens_type.replace('_', ' ')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Info className="h-4 w-4" />
                                <span>Por: {measurement.measured_by}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(measurement)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(measurement.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            {/* DPN Calculator Dialog */}
            <Dialog open={calculatorOpen} onOpenChange={setCalculatorOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Calculadora DPN (Distância Pupilar Nasal)
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium mb-2">Como calcular DPN:</h3>
                    <p className="text-sm text-gray-600">
                      A DPN (Distância Pupilar Nasal) é metade da distância pupilar total.
                      Para cada olho: DPN = DP Total ÷ 2
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">DP Total (mm):</label>
                      <Input 
                        type="number" 
                        placeholder="Ex: 65.0"
                        onChange={(e) => {
                          const pd = parseFloat(e.target.value);
                          if (pd) {
                            const dpn = calculateDPN(pd);
                            document.getElementById('dpn-result')!.textContent = `DPN: ${dpn}mm para cada olho`;
                          }
                        }}
                      />
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded">
                      <p id="dpn-result" className="font-medium">
                        Insira a DP total para calcular a DPN
                      </p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Editar Medição Óptica</DialogTitle>
                </DialogHeader>
                <Form {...editForm}>
                  <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
                    {/* Similar structure as add form */}
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}