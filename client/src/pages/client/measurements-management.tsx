import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Plus, Edit, Trash2, Eye, Camera, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Schema para medição óptica
const measurementSchema = z.object({
  sphere_right: z.number(),
  cylinder_right: z.number(),
  axis_right: z.number(),
  sphere_left: z.number(),
  cylinder_left: z.number(),
  axis_left: z.number(),
  addition: z.number().optional(),
  pupillary_distance: z.number(),
  measurement_type: z.enum(["glasses", "contact_lens", "both"]),
  notes: z.string().optional(),
});

type MeasurementFormData = z.infer<typeof measurementSchema>;

interface Measurement {
  id: number;
  sphere_right: number;
  cylinder_right: number;
  axis_right: number;
  sphere_left: number;
  cylinder_left: number;
  axis_left: number;
  addition?: number;
  pupillary_distance: number;
  measurement_type: string;
  notes?: string;
  measured_at: string;
  user_id: number;
}

export default function MeasurementsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMeasurement, setEditingMeasurement] = useState<Measurement | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar medições
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

  const editMutation = useMutation({
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
      measurement_type: "glasses",
      sphere_right: 0,
      cylinder_right: 0,
      axis_right: 0,
      sphere_left: 0,
      cylinder_left: 0,
      axis_left: 0,
      pupillary_distance: 62,
    },
  });

  const editForm = useForm<MeasurementFormData>({
    resolver: zodResolver(measurementSchema),
  });

  // Filtrar medições por busca
  const filteredMeasurements = measurements.filter((measurement: Measurement) =>
    searchTerm === "" || 
    measurement.measurement_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (measurement.notes && measurement.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAdd = (data: MeasurementFormData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (data: MeasurementFormData) => {
    if (editingMeasurement) {
      editMutation.mutate({ id: editingMeasurement.id, data });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta medição?")) {
      deleteMutation.mutate(id);
    }
  };

  const openEditDialog = (measurement: Measurement) => {
    setEditingMeasurement(measurement);
    editForm.reset({
      sphere_right: measurement.sphere_right,
      cylinder_right: measurement.cylinder_right,
      axis_right: measurement.axis_right,
      sphere_left: measurement.sphere_left,
      cylinder_left: measurement.cylinder_left,
      axis_left: measurement.axis_left,
      addition: measurement.addition || 0,
      pupillary_distance: measurement.pupillary_distance,
      measurement_type: measurement.measurement_type as any,
      notes: measurement.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'glasses': return 'bg-blue-100 text-blue-800';
      case 'contact_lens': return 'bg-green-100 text-green-800';
      case 'both': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'glasses': return <Eye className="h-4 w-4" />;
      case 'contact_lens': return <Camera className="h-4 w-4" />;
      case 'both': return <TrendingUp className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
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
                <h2 className="text-2xl font-bold text-gray-900">Minhas Medições Ópticas</h2>
                <p className="text-gray-600">Histórico e gerenciamento das suas medições</p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Medição
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Nova Medição Óptica</DialogTitle>
                  </DialogHeader>
                  <Form {...addForm}>
                    <form onSubmit={addForm.handleSubmit(handleAdd)} className="space-y-4">
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
                                <SelectItem value="glasses">Óculos</SelectItem>
                                <SelectItem value="contact_lens">Lente de Contato</SelectItem>
                                <SelectItem value="both">Ambos</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Olho Direito */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-3">Olho Direito (OD)</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={addForm.control}
                            name="sphere_right"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Esfera</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.25"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={addForm.control}
                            name="cylinder_right"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cilindro</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.25"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={addForm.control}
                            name="axis_right"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Eixo</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number"
                                    min="0"
                                    max="180"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Olho Esquerdo */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-3">Olho Esquerdo (OE)</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={addForm.control}
                            name="sphere_left"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Esfera</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.25"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={addForm.control}
                            name="cylinder_left"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cilindro</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.25"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={addForm.control}
                            name="axis_left"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Eixo</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number"
                                    min="0"
                                    max="180"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Informações Adicionais */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={addForm.control}
                          name="pupillary_distance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Distância Pupilar (mm)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 62)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={addForm.control}
                          name="addition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adição (opcional)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.25"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Observações sobre a medição..."
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Medições</p>
                    <p className="text-xl font-bold">{measurements.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Última Medição</p>
                    <p className="text-xl font-bold">
                      {measurements.length > 0 
                        ? format(new Date(measurements[0]?.measured_at), 'dd/MM/yyyy')
                        : "Nenhuma"
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Histórico</p>
                    <p className="text-xl font-bold">Completo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Pesquisar medições..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data & Tipo</TableHead>
                    <TableHead>Olho Direito</TableHead>
                    <TableHead>Olho Esquerdo</TableHead>
                    <TableHead>DP / Adição</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : filteredMeasurements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhuma medição encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMeasurements.map((measurement: Measurement, index: number) => (
                      <motion.tr
                        key={measurement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium">
                                {format(new Date(measurement.measured_at), 'dd/MM/yyyy')}
                              </div>
                              <Badge 
                                variant="secondary" 
                                className={`${getTypeColor(measurement.measurement_type)} flex items-center gap-1 w-fit mt-1`}
                              >
                                {getTypeIcon(measurement.measurement_type)}
                                {measurement.measurement_type}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div>ESF: {measurement.sphere_right}</div>
                            <div>CIL: {measurement.cylinder_right}</div>
                            <div>EIXO: {measurement.axis_right}°</div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div>ESF: {measurement.sphere_left}</div>
                            <div>CIL: {measurement.cylinder_left}</div>
                            <div>EIXO: {measurement.axis_left}°</div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div>DP: {measurement.pupillary_distance}mm</div>
                            {measurement.addition && (
                              <div>ADD: {measurement.addition}</div>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {measurement.notes || "-"}
                          </span>
                        </TableCell>
                        
                        <TableCell>
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
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Editar Medição</DialogTitle>
                </DialogHeader>
                <Form {...editForm}>
                  <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
                    {/* Form content similar to add form */}
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={editMutation.isPending}
                    >
                      {editMutation.isPending ? "Salvando..." : "Salvar Alterações"}
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