import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlanFormModalProps {
  plan?: any;
  onSave: (planData: any) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function PlanFormModal({ plan, onSave, onCancel, isLoading }: PlanFormModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    type: "basic",
    consultations_limit: 12,
    measurements_limit: 12,
    features: "",
    active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        description: plan.description || "",
        price: plan.price || 0,
        type: plan.type || "basic",
        consultations_limit: plan.consultations_limit || 12,
        measurements_limit: plan.measurements_limit || 12,
        features: plan.features || "",
        active: plan.active !== false
      });
    }
  }, [plan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || formData.price <= 0) {
      toast({
        title: "Erro de validação",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    setOpen(false);
    
    // Reset form if creating new plan
    if (!plan) {
      setFormData({
        name: "",
        description: "",
        price: 0,
        type: "basic",
        consultations_limit: 12,
        measurements_limit: 12,
        features: "",
        active: true
      });
    }
  };

  const handleCancel = () => {
    setOpen(false);
    if (onCancel) onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {plan ? (
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Plano
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {plan ? <Edit className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
            {plan ? "Editar Plano" : "Criar Novo Plano"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Plano *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Visão+ Básico"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price">Preço Mensal (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="49.90"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição detalhada do plano..."
              rows={3}
              required
            />
          </div>

          {/* Tipo do plano */}
          <div>
            <Label>Tipo do Plano</Label>
            <div className="flex gap-2 mt-2">
              {["basic", "gold", "premium"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type }))}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.type === type
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
                  }`}
                >
                  <Badge variant={type === formData.type ? "default" : "secondary"}>
                    {type === "basic" ? "Básico" : type === "gold" ? "Gold" : "Premium"}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Limites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="consultations_limit">Limite de Consultas/Ano</Label>
              <Input
                id="consultations_limit"
                type="number"
                min="1"
                value={formData.consultations_limit}
                onChange={(e) => setFormData(prev => ({ ...prev, consultations_limit: parseInt(e.target.value) || 1 }))}
              />
            </div>
            
            <div>
              <Label htmlFor="measurements_limit">Limite de Medições/Ano</Label>
              <Input
                id="measurements_limit"
                type="number"
                min="1"
                value={formData.measurements_limit}
                onChange={(e) => setFormData(prev => ({ ...prev, measurements_limit: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          {/* Recursos adicionais */}
          <div>
            <Label htmlFor="features">Recursos Inclusos</Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
              placeholder="Ex: Lentes antirreflexo, Armação premium, Garantia estendida..."
              rows={2}
            />
          </div>

          {/* Status ativo */}
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="active">Plano Ativo</Label>
          </div>

          {/* Preview do plano */}
          <div className="bg-gradient-to-r from-purple-50 to-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Preview do Plano:</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Nome:</strong> {formData.name || "Nome do plano"}</p>
              <p><strong>Preço:</strong> R$ {formData.price.toFixed(2)}/mês</p>
              <p><strong>Tipo:</strong> {formData.type === "basic" ? "Básico" : formData.type === "gold" ? "Gold" : "Premium"}</p>
              <p><strong>Consultas:</strong> {formData.consultations_limit}/ano</p>
              <p><strong>Medições:</strong> {formData.measurements_limit}/ano</p>
              <p><strong>Status:</strong> {formData.active ? "Ativo" : "Inativo"}</p>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Salvando..." : plan ? "Atualizar Plano" : "Criar Plano"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}