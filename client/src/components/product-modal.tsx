import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertProductSchema, type Product } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity.toString(),
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        quantity: "",
      });
    }
  }, [product, isOpen]);

  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/products", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      onClose();
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PUT", `/api/products/${product!.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = insertProductSchema.parse({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        quantity: parseInt(formData.quantity),
      });

      if (isEdit) {
        updateProductMutation.mutate(productData);
      } else {
        createProductMutation.mutate(productData);
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isLoading = createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-900">
            {isEdit ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
              Product Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter product name"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-slate-700">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              placeholder="Describe your product"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-slate-700">
                Price ($)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={handleInputChange}
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium text-slate-700">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                required
                value={formData.quantity}
                onChange={handleInputChange}
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="0"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isEdit ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  {isEdit ? "Update Product" : "Add Product"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
