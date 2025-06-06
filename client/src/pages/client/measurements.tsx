import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMeasurementSchema, type Measurement, type InsertMeasurement } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Eye, 
  Plus, 
  Download,
  Share,
  Calendar,
  Activity,
  TrendingUp
} from "lucide-react";

export default function ClientMeasurements() {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Buscar medições do usuário
  const { data: measurements = [], isLoading } = useQuery<Measurement[]>({
    queryKey: ["/api/measurements", user?.id],
    queryFn: () => apiRequest(`/api/measurements?userId=${user?.id}`),
    enabled: !!user?.id
  });

  const form = useForm<InsertMeasurement>({
    resolver: zodResolver(insertMeasurementSchema),
    defaultValues: {
      measurement_type: "",
      left_eye_sphere: 0,
      left_eye_cylinder: 0,
      left_eye_axis: 0,
      right_eye_sphere: 0,
      right_eye_cylinder: 0,
      right_eye_axis: 0,
      pd_distance: 0,
      notes: ""
    },
  });

  // Mutation para criar medição
  const createMutation = useMutation({
    mutationFn: (data: InsertMeasurement) => apiRequest("/api/measurements", {
      method: "POST",
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/measurements", user?.id] });
      setIsCreateModalOpen(false);
      form.reset();
      toast({
        title: "Medição registrada!",
        description: "Sua medição ótica foi salva com sucesso."
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a medição. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertMeasurement) => {
    createMutation.mutate({
      ...data,
      user_id: user?.id || 0
    });
  };

  const latestMeasurement = measurements.sort((a, b) => 
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  )[0];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userType="client" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Minhas Medições Óticas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Acompanhe o histórico das suas medições e receitas médicas
              </p>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Medição
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Registrar Nova Medição</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
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
                              <SelectItem value="grau">Medição de Grau</SelectItem>
                              <SelectItem value="pressao">Pressão Ocular</SelectItem>
                              <SelectItem value="campo-visual">Campo Visual</SelectItem>
                              <SelectItem value="refração">Refração</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-6">
                      {/* Olho Esquerdo */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Olho Esquerdo</h3>
                        
                        <FormField
                          control={form.control}
                          name="left_eye_sphere"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Esférico</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.25"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="left_eye_cylinder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cilíndrico</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.25"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="left_eye_axis"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Eixo</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Olho Direito */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Olho Direito</h3>
                        
                        <FormField
                          control={form.control}
                          name="right_eye_sphere"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Esférico</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.25"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="right_eye_cylinder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cilíndrico</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.25"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="right_eye_axis"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Eixo</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
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

                    <FormField
                      control={form.control}
                      name="pd_distance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Distância Pupilar (DP)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="65"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Observações sobre a medição..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCreateModalOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Medições</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{measurements.length}</div>
                <p className="text-xs text-muted-foreground">Registradas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Última Medição</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestMeasurement ? 
                    format(new Date(latestMeasurement.created_at || 0), "dd/MM", { locale: ptBR }) : 
                    "Nenhuma"
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {latestMeasurement ? "Disponível" : "Registre a primeira"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progresso</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {measurements.length > 1 ? "Estável" : "Inicial"}
                </div>
                <p className="text-xs text-muted-foreground">Status da visão</p>
              </CardContent>
            </Card>
          </div>

          {/* Histórico de Medições */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Medições</CardTitle>
              <CardDescription>
                Suas medições óticas registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {measurements.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma medição registrada</p>
                  <Button 
                    className="mt-4" 
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Registrar Primeira Medição
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {measurements.map((measurement, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {measurement.measurement_type || 'Medição Ótica'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {format(new Date(measurement.created_at || 0), "PPP", { locale: ptBR })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            PDF
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="h-4 w-4 mr-2" />
                            Compartilhar
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Olho Esquerdo */}
                        <div>
                          <h4 className="font-medium mb-2 text-purple-600 dark:text-purple-400">
                            Olho Esquerdo
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p>Esférico: <span className="font-mono">{measurement.left_eye_sphere}</span></p>
                            <p>Cilíndrico: <span className="font-mono">{measurement.left_eye_cylinder}</span></p>
                            <p>Eixo: <span className="font-mono">{measurement.left_eye_axis}°</span></p>
                          </div>
                        </div>

                        {/* Olho Direito */}
                        <div>
                          <h4 className="font-medium mb-2 text-orange-600 dark:text-orange-400">
                            Olho Direito
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p>Esférico: <span className="font-mono">{measurement.right_eye_sphere}</span></p>
                            <p>Cilíndrico: <span className="font-mono">{measurement.right_eye_cylinder}</span></p>
                            <p>Eixo: <span className="font-mono">{measurement.right_eye_axis}°</span></p>
                          </div>
                        </div>
                      </div>

                      {measurement.pd_distance && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm">
                            <strong>Distância Pupilar:</strong> <span className="font-mono">{measurement.pd_distance}mm</span>
                          </p>
                        </div>
                      )}

                      {measurement.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm">
                            <strong>Observações:</strong> {measurement.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}