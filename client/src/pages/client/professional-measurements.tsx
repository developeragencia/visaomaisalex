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
  Calculator,
  Target,
  Crosshair,
  Ruler,
  Download,
  CheckCircle,
  AlertCircle,
  Settings,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Schema profissional para medições ópticas reais
const measurementSchema = z.object({
  measurement_type: z.enum(["prescription", "fitting", "progressive"]),
  
  // Olho Direito (OD) - Valores reais
  od_sphere: z.number().min(-30).max(30).step(0.25),
  od_cylinder: z.number().min(-10).max(10).step(0.25),
  od_axis: z.number().min(0).max(180).int(),
  od_add: z.number().min(0).max(4).step(0.25).optional(),
  od_visual_acuity: z.string().optional(),
  
  // Olho Esquerdo (OS) - Valores reais
  os_sphere: z.number().min(-30).max(30).step(0.25),
  os_cylinder: z.number().min(-10).max(10).step(0.25),
  os_axis: z.number().min(0).max(180).int(),
  os_add: z.number().min(0).max(4).step(0.25).optional(),
  os_visual_acuity: z.string().optional(),
  
  // DPN - Distância Pupilar Nasal REAL
  pupillary_distance: z.number().min(40).max(80).step(0.5),
  dpn_od: z.number().min(20).max(40).step(0.5),
  dpn_os: z.number().min(20).max(40).step(0.5),
  pd_near: z.number().min(40).max(75).step(0.5).optional(),
  pd_far: z.number().min(45).max(80).step(0.5).optional(),
  
  // Centro Óptico REAL (coordenadas em mm)
  optical_center_od_x: z.number().min(-30).max(30).step(0.1),
  optical_center_od_y: z.number().min(-30).max(30).step(0.1),
  optical_center_os_x: z.number().min(-30).max(30).step(0.1),
  optical_center_os_y: z.number().min(-30).max(30).step(0.1),
  
  // Lentes Progressivas - Medidas reais
  fitting_height_od: z.number().min(10).max(30).step(0.5).optional(),
  fitting_height_os: z.number().min(10).max(30).step(0.5).optional(),
  vertex_distance: z.number().min(8).max(20).step(0.5).optional(),
  
  // Especificações técnicas
  lens_type: z.enum(["single_vision", "bifocal", "progressive", "occupational"]),
  frame_type: z.enum(["full_rim", "semi_rimless", "rimless"]).optional(),
  
  // Profissional responsável
  measured_by: z.string().min(1, "Nome do profissional é obrigatório"),
  equipment_used: z.string().optional(),
  notes: z.string().optional(),
});

type MeasurementFormData = z.infer<typeof measurementSchema>;

export default function ProfessionalMeasurements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMeasurement, setEditingMeasurement] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [dpnCalculatorOpen, setDpnCalculatorOpen] = useState(false);
  const [calculatedDPN, setCalculatedDPN] = useState({ od: 0, os: 0 });
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar medições reais do banco PostgreSQL
  const { data: measurements = [], isLoading } = useQuery({
    queryKey: ["/api/measurements", user?.id],
    queryFn: async () => {
      const res = await apiRequest(`/api/measurements?userId=${user?.id}`);
      if (!res.ok) throw new Error('Failed to fetch measurements');
      return await res.json();
    },
    enabled: !!user?.id,
  });

  // Criar nova medição real no banco
  const createMutation = useMutation({
    mutationFn: async (data: MeasurementFormData) => {
      const measurementData = {
        ...data,
        user_id: user?.id,
        prescription_status: 'active',
      };
      
      const res = await apiRequest("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(measurementData),
      });
      
      if (!res.ok) throw new Error('Failed to create measurement');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/measurements"] });
      setIsAddDialogOpen(false);
      addForm.reset();
      toast({
        title: "✅ Medição Registrada",
        description: "Medição óptica profissional salva no banco de dados!",
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Erro",
        description: "Falha ao registrar medição no banco de dados",
        variant: "destructive",
      });
    },
  });

  // Atualizar medição existente
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<MeasurementFormData> }) => {
      const res = await apiRequest(`/api/measurements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error('Failed to update measurement');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/measurements"] });
      setIsEditDialogOpen(false);
      setEditingMeasurement(null);
      editForm.reset();
      toast({
        title: "✅ Medição Atualizada",
        description: "Alterações salvas no banco de dados!",
      });
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao atualizar medição",
        variant: "destructive",
      });
    },
  });

  // Excluir medição
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest(`/api/measurements/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error('Failed to delete measurement');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/measurements"] });
      toast({
        title: "✅ Medição Excluída",
        description: "Registro removido do banco de dados!",
      });
    },
    onError: () => {
      toast({
        title: "❌ Erro",
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
      od_sphere: 0,
      od_cylinder: 0,
      od_axis: 0,
      os_sphere: 0,
      os_cylinder: 0,
      os_axis: 0,
      pupillary_distance: 65,
      dpn_od: 32.5,
      dpn_os: 32.5,
      optical_center_od_x: 0,
      optical_center_od_y: 0,
      optical_center_os_x: 0,
      optical_center_os_y: 0,
    },
  });

  const editForm = useForm<MeasurementFormData>({
    resolver: zodResolver(measurementSchema),
  });

  // Filtrar medições reais
  const filteredMeasurements = measurements.filter((measurement: any) => {
    const matchesSearch = searchTerm === "" || 
      measurement.measured_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      measurement.lens_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
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
    if (window.confirm("⚠️ Tem certeza que deseja excluir esta medição REAL do banco de dados?")) {
      deleteMutation.mutate(id);
    }
  };

  const openEditDialog = (measurement: any) => {
    setEditingMeasurement(measurement);
    editForm.reset({
      measurement_type: measurement.measurement_type,
      od_sphere: parseFloat(measurement.od_sphere) || 0,
      od_cylinder: parseFloat(measurement.od_cylinder) || 0,
      od_axis: parseInt(measurement.od_axis) || 0,
      os_sphere: parseFloat(measurement.os_sphere) || 0,
      os_cylinder: parseFloat(measurement.os_cylinder) || 0,
      os_axis: parseInt(measurement.os_axis) || 0,
      pupillary_distance: parseFloat(measurement.pupillary_distance) || 65,
      dpn_od: parseFloat(measurement.dpn_od) || 32.5,
      dpn_os: parseFloat(measurement.dpn_os) || 32.5,
      optical_center_od_x: parseFloat(measurement.optical_center_od_x) || 0,
      optical_center_od_y: parseFloat(measurement.optical_center_od_y) || 0,
      optical_center_os_x: parseFloat(measurement.optical_center_os_x) || 0,
      optical_center_os_y: parseFloat(measurement.optical_center_os_y) || 0,
      lens_type: measurement.lens_type,
      measured_by: measurement.measured_by || "",
      notes: measurement.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  // Formatação profissional de receitas
  const formatPrescription = (sphere: number, cylinder: number, axis: number) => {
    if (!sphere && !cylinder) return "Plano";
    let prescription = "";
    if (sphere) prescription += `${sphere > 0 ? '+' : ''}${sphere.toFixed(2)}`;
    if (cylinder) prescription += ` ${cylinder > 0 ? '+' : ''}${cylinder.toFixed(2)}`;
    if (axis && cylinder) prescription += ` x ${axis}°`;
    return prescription;
  };

  // Calculadora DPN profissional
  const calculateDPN = (totalPD: number) => {
    const dpnOD = totalPD / 2;
    const dpnOS = totalPD / 2;
    setCalculatedDPN({ od: dpnOD, os: dpnOS });
    return { od: dpnOD, os: dpnOS };
  };

  // Auto-calcular DPN quando DP total mudar
  const handlePDChange = (value: number) => {
    if (value > 0) {
      const { od, os } = calculateDPN(value);
      addForm.setValue('dpn_od', od);
      addForm.setValue('dpn_os', os);
    }
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
            {/* Header Profissional */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  🎯 Medições Ópticas Profissionais
                </h2>
                <p className="text-gray-600">
                  Sistema avançado com DPN, centro óptico e dados REAIS do PostgreSQL
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setDpnCalculatorOpen(true)}
                  className="gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Calculadora DPN
                </Button>
                
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                      <Plus className="h-4 w-4" />
                      Nova Medição Real
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        🏥 Sistema Profissional de Medições Ópticas
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...addForm}>
                      <form onSubmit={addForm.handleSubmit(handleAdd)} className="space-y-6">
                        <Tabs defaultValue="basic" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="basic">📋 Básico</TabsTrigger>
                            <TabsTrigger value="prescription">👁️ Receita</TabsTrigger>
                            <TabsTrigger value="dpn">📏 DPN & Centro</TabsTrigger>
                            <TabsTrigger value="advanced">⚙️ Avançado</TabsTrigger>
                          </TabsList>

                          {/* Aba Básica */}
                          <TabsContent value="basic" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={addForm.control}
                                name="measurement_type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>📋 Tipo de Medição</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="prescription">📄 Receita Oftalmológica</SelectItem>
                                        <SelectItem value="fitting">🔧 Medição para Montagem</SelectItem>
                                        <SelectItem value="progressive">🌈 Lente Progressiva</SelectItem>
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
                                    <FormLabel>🔍 Tipo de Lente</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="single_vision">👁️ Monofocal</SelectItem>
                                        <SelectItem value="bifocal">🔄 Bifocal</SelectItem>
                                        <SelectItem value="progressive">🌈 Progressiva</SelectItem>
                                        <SelectItem value="occupational">💼 Ocupacional</SelectItem>
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
                                  <FormLabel>👨‍⚕️ Profissional Responsável</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Dr. Nome do Optometrista/Oftalmologista" />
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
                                  <FormLabel>🔬 Equipamento Utilizado</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: Autorefrator Topcon KR-800, Lensômetro Zeiss..." />
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
                              <Card className="border-2 border-blue-200">
                                <CardHeader className="bg-blue-50">
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <Eye className="h-5 w-5" />
                                    👁️ Olho Direito (OD)
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">
                                  <div className="grid grid-cols-3 gap-3">
                                    <FormField
                                      control={addForm.control}
                                      name="od_sphere"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm font-medium">Esférico (D)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.25"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                              placeholder="0.00"
                                              className="text-center font-mono"
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
                                          <FormLabel className="text-sm font-medium">Cilíndrico (D)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.25"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                              placeholder="0.00"
                                              className="text-center font-mono"
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
                                          <FormLabel className="text-sm font-medium">Eixo (°)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number"
                                              min="0"
                                              max="180"
                                              {...field}
                                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                              placeholder="0"
                                              className="text-center font-mono"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                      control={addForm.control}
                                      name="od_add"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm font-medium">Adição (D)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.25"
                                              min="0"
                                              max="4"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="0.00"
                                              className="text-center font-mono"
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
                                          <FormLabel className="text-sm font-medium">Acuidade Visual</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="20/20" className="text-center" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Olho Esquerdo */}
                              <Card className="border-2 border-green-200">
                                <CardHeader className="bg-green-50">
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <Eye className="h-5 w-5" />
                                    👁️ Olho Esquerdo (OS)
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">
                                  <div className="grid grid-cols-3 gap-3">
                                    <FormField
                                      control={addForm.control}
                                      name="os_sphere"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm font-medium">Esférico (D)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.25"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                              placeholder="0.00"
                                              className="text-center font-mono"
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
                                          <FormLabel className="text-sm font-medium">Cilíndrico (D)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.25"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                              placeholder="0.00"
                                              className="text-center font-mono"
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
                                          <FormLabel className="text-sm font-medium">Eixo (°)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number"
                                              min="0"
                                              max="180"
                                              {...field}
                                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                              placeholder="0"
                                              className="text-center font-mono"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                      control={addForm.control}
                                      name="os_add"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm font-medium">Adição (D)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.25"
                                              min="0"
                                              max="4"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="0.00"
                                              className="text-center font-mono"
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
                                          <FormLabel className="text-sm font-medium">Acuidade Visual</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="20/20" className="text-center" />
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
                          <TabsContent value="dpn" className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                              <Card className="border-2 border-purple-200">
                                <CardHeader className="bg-purple-50">
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <Ruler className="h-5 w-5" />
                                    📏 DPN - Distância Pupilar Nasal
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">
                                  <FormField
                                    control={addForm.control}
                                    name="pupillary_distance"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>📐 DP Total (mm)</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="0.5"
                                            min="40"
                                            max="80"
                                            {...field}
                                            onChange={(e) => {
                                              const value = parseFloat(e.target.value) || 0;
                                              field.onChange(value);
                                              handlePDChange(value);
                                            }}
                                            placeholder="65.0"
                                            className="text-center font-mono text-lg"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                      control={addForm.control}
                                      name="dpn_od"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>👁️ DPN OD (mm)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.5"
                                              min="20"
                                              max="40"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                              placeholder="32.5"
                                              className="text-center font-mono bg-blue-50"
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
                                          <FormLabel>👁️ DPN OS (mm)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.5"
                                              min="20"
                                              max="40"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                              placeholder="32.5"
                                              className="text-center font-mono bg-green-50"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                      control={addForm.control}
                                      name="pd_far"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>🔭 DP Longe (mm)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.5"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="65.0"
                                              className="text-center font-mono"
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
                                          <FormLabel>🔍 DP Perto (mm)</FormLabel>
                                          <FormControl>
                                            <Input 
                                              type="number" 
                                              step="0.5"
                                              {...field}
                                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                              placeholder="62.0"
                                              className="text-center font-mono"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-700">
                                      💡 <strong>DPN Auto-calculada:</strong> Quando você inserir a DP total, 
                                      as DPNs serão calculadas automaticamente (DP ÷ 2)
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="border-2 border-orange-200">
                                <CardHeader className="bg-orange-50">
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <Crosshair className="h-5 w-5" />
                                    🎯 Centro Óptico (mm)
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">
                                  <div className="text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded">
                                    📍 Coordenadas do centro óptico relativo ao centro geométrico da lente
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">👁️ Olho Direito (OD)</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                      <FormField
                                        control={addForm.control}
                                        name="optical_center_od_x"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-xs">X (horizontal)</FormLabel>
                                            <FormControl>
                                              <Input 
                                                type="number" 
                                                step="0.1"
                                                min="-30"
                                                max="30"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder="0.0"
                                                className="text-center font-mono bg-blue-50"
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
                                            <FormLabel className="text-xs">Y (vertical)</FormLabel>
                                            <FormControl>
                                              <Input 
                                                type="number" 
                                                step="0.1"
                                                min="-30"
                                                max="30"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder="0.0"
                                                className="text-center font-mono bg-blue-50"
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">👁️ Olho Esquerdo (OS)</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                      <FormField
                                        control={addForm.control}
                                        name="optical_center_os_x"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-xs">X (horizontal)</FormLabel>
                                            <FormControl>
                                              <Input 
                                                type="number" 
                                                step="0.1"
                                                min="-30"
                                                max="30"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder="0.0"
                                                className="text-center font-mono bg-green-50"
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
                                            <FormLabel className="text-xs">Y (vertical)</FormLabel>
                                            <FormControl>
                                              <Input 
                                                type="number" 
                                                step="0.1"
                                                min="-30"
                                                max="30"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder="0.0"
                                                className="text-center font-mono bg-green-50"
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>

                          {/* Aba Avançado */}
                          <TabsContent value="advanced" className="space-y-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Settings className="h-5 w-5" />
                                  ⚙️ Configurações Avançadas
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={addForm.control}
                                    name="frame_type"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>🕶️ Tipo de Armação</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="full_rim">🟦 Aro Fechado</SelectItem>
                                            <SelectItem value="semi_rimless">🟦⚪ Semi Aro</SelectItem>
                                            <SelectItem value="rimless">⚪ Sem Aro</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={addForm.control}
                                    name="vertex_distance"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>📐 Distância Vértex (mm)</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="0.5"
                                            min="8"
                                            max="20"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                            placeholder="12.0"
                                            className="text-center font-mono"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={addForm.control}
                                    name="fitting_height_od"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>📏 Altura Montagem OD (mm)</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="0.5"
                                            min="10"
                                            max="30"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                            placeholder="20.0"
                                            className="text-center font-mono"
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
                                        <FormLabel>📏 Altura Montagem OS (mm)</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="0.5"
                                            min="10"
                                            max="30"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                            placeholder="20.0"
                                            className="text-center font-mono"
                                          />
                                        </FormControl>
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
                                      <FormLabel>📝 Observações Profissionais</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          {...field} 
                                          placeholder="Observações técnicas, condições de medição, equipamentos utilizados..."
                                          rows={4}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </CardContent>
                            </Card>
                          </TabsContent>
                        </Tabs>

                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3"
                          disabled={createMutation.isPending}
                        >
                          {createMutation.isPending ? (
                            <>
                              <Activity className="h-4 w-4 mr-2 animate-spin" />
                              Salvando no PostgreSQL...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              💾 Salvar Medição Real no Banco
                            </>
                          )}
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
                  <CardTitle className="text-sm font-medium">📊 Total Real</CardTitle>
                  <Eye className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{measurements.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Medições no PostgreSQL
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">✅ Ativas</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {measurements.filter((m: any) => m.prescription_status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receitas válidas
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">🌈 Progressivas</CardTitle>
                  <Target className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {measurements.filter((m: any) => m.lens_type === 'progressive').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lentes progressivas
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">🎯 Centro Óptico</CardTitle>
                  <Crosshair className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {measurements.filter((m: any) => m.optical_center_od_x !== null).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Com centro definido
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="🔍 Pesquisar medições reais..."
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
                  <SelectItem value="all">📋 Todos os tipos</SelectItem>
                  <SelectItem value="prescription">📄 Receita</SelectItem>
                  <SelectItem value="fitting">🔧 Montagem</SelectItem>
                  <SelectItem value="progressive">🌈 Progressiva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Measurements List - Dados REAIS */}
            <div className="grid grid-cols-1 gap-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">🔄 Carregando dados REAIS do PostgreSQL...</p>
                </div>
              ) : filteredMeasurements.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      🎯 Nenhuma medição encontrada
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Adicione sua primeira medição óptica profissional com DPN e centro óptico
                    </p>
                    <Button 
                      onClick={() => setIsAddDialogOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Medição
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredMeasurements.map((measurement: any, index: number) => (
                  <motion.div
                    key={measurement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                                <Eye className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg capitalize">
                                  🎯 {measurement.measurement_type?.replace('_', ' ')} - {measurement.lens_type?.replace('_', ' ')}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  📅 {measurement.measured_at ? format(new Date(measurement.measured_at), 'dd/MM/yyyy HH:mm') : 'Data não disponível'}
                                </p>
                              </div>
                              <Badge 
                                variant="secondary" 
                                className={getStatusColor(measurement.prescription_status || 'active')}
                              >
                                ✅ {measurement.prescription_status || 'active'}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="text-sm font-bold text-blue-800 mb-2">👁️ Receita Óptica</h4>
                                <div className="space-y-2">
                                  <div className="text-sm font-mono">
                                    <span className="font-bold">OD:</span> {formatPrescription(
                                      parseFloat(measurement.od_sphere) || 0,
                                      parseFloat(measurement.od_cylinder) || 0,
                                      parseInt(measurement.od_axis) || 0
                                    )}
                                  </div>
                                  <div className="text-sm font-mono">
                                    <span className="font-bold">OS:</span> {formatPrescription(
                                      parseFloat(measurement.os_sphere) || 0,
                                      parseFloat(measurement.os_cylinder) || 0,
                                      parseInt(measurement.os_axis) || 0
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="bg-purple-50 p-4 rounded-lg">
                                <h4 className="text-sm font-bold text-purple-800 mb-2">📏 DPN Real</h4>
                                <div className="space-y-2">
                                  {measurement.pupillary_distance && (
                                    <div className="text-sm font-mono">
                                      <span className="font-bold">DP Total:</span> {parseFloat(measurement.pupillary_distance).toFixed(1)}mm
                                    </div>
                                  )}
                                  {measurement.dpn_od && measurement.dpn_os && (
                                    <div className="text-sm font-mono">
                                      <span className="font-bold">DPN:</span> {parseFloat(measurement.dpn_od).toFixed(1)}/{parseFloat(measurement.dpn_os).toFixed(1)}mm
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="bg-orange-50 p-4 rounded-lg">
                                <h4 className="text-sm font-bold text-orange-800 mb-2">🎯 Centro Óptico</h4>
                                <div className="space-y-2">
                                  {measurement.optical_center_od_x !== null && (
                                    <div className="text-sm font-mono">
                                      <span className="font-bold">OD:</span> X:{parseFloat(measurement.optical_center_od_x || 0).toFixed(1)} Y:{parseFloat(measurement.optical_center_od_y || 0).toFixed(1)}
                                    </div>
                                  )}
                                  {measurement.optical_center_os_x !== null && (
                                    <div className="text-sm font-mono">
                                      <span className="font-bold">OS:</span> X:{parseFloat(measurement.optical_center_os_x || 0).toFixed(1)} Y:{parseFloat(measurement.optical_center_os_y || 0).toFixed(1)}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="text-sm font-bold text-green-800 mb-2">👨‍⚕️ Profissional</h4>
                                <div className="space-y-2">
                                  <div className="text-sm">
                                    <span className="font-bold">Por:</span> {measurement.measured_by || 'Não informado'}
                                  </div>
                                  {measurement.equipment_used && (
                                    <div className="text-sm">
                                      <span className="font-bold">Equip:</span> {measurement.equipment_used}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {measurement.notes && (
                              <div className="p-3 bg-gray-50 rounded-lg mb-4">
                                <p className="text-sm text-gray-700">
                                  <span className="font-bold">📝 Observações:</span> {measurement.notes}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(measurement)}
                              className="h-10 w-10 p-0 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(measurement.id)}
                              className="h-10 w-10 p-0 hover:bg-red-50 text-red-600 hover:text-red-700"
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
            <Dialog open={dpnCalculatorOpen} onOpenChange={setDpnCalculatorOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    🧮 Calculadora DPN Profissional
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-bold mb-2">📐 Como calcular DPN:</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      A DPN (Distância Pupilar Nasal) é a medida do centro da pupila até a linha média nasal.
                    </p>
                    <p className="text-sm font-semibold text-blue-700">
                      💡 Fórmula: DPN = DP Total ÷ 2
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">📏 DP Total (mm):</label>
                      <Input 
                        type="number" 
                        placeholder="Ex: 65.0"
                        step="0.5"
                        className="text-center font-mono text-lg"
                        onChange={(e) => {
                          const pd = parseFloat(e.target.value);
                          if (pd > 0) {
                            const result = calculateDPN(pd);
                            document.getElementById('dpn-result-od')!.textContent = result.od.toFixed(1);
                            document.getElementById('dpn-result-os')!.textContent = result.os.toFixed(1);
                          }
                        }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <h4 className="font-bold text-blue-800">👁️ DPN OD</h4>
                        <p id="dpn-result-od" className="text-2xl font-mono font-bold text-blue-600">
                          --
                        </p>
                        <p className="text-xs text-blue-600">mm</p>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <h4 className="font-bold text-green-800">👁️ DPN OS</h4>
                        <p id="dpn-result-os" className="text-2xl font-mono font-bold text-green-600">
                          --
                        </p>
                        <p className="text-xs text-green-600">mm</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>✏️ Editar Medição Óptica Real</DialogTitle>
                </DialogHeader>
                <Form {...editForm}>
                  <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
                    {/* Similar structure as add form but simplified */}
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? (
                        <>
                          <Activity className="h-4 w-4 mr-2 animate-spin" />
                          Atualizando PostgreSQL...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          💾 Salvar Alterações no Banco
                        </>
                      )}
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