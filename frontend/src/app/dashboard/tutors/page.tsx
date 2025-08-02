'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import { tutorService } from '@/services/tutor.service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function TutorsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tutors, setTutors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber1: '',
    contactNumber2: '',
    password: '',
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    contactNumber1: '',
    contactNumber2: '',
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      loadTutors();
    }
  }, [user]);

  const loadTutors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiTutors = await tutorService.getAllTutors();
      setTutors(apiTutors);
    } catch (error) {
      console.error('Error loading tutors:', error);
      setError('Error al cargar tutores: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Remove status filter since tutors don't have active/inactive status
    return matchesSearch;
  });

  const handleCreateTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const tutorData = {
        nombre: formData.name,
        email: formData.email,
        contactNumber1: formData.contactNumber1,
        contactNumber2: formData.contactNumber2,
        password: formData.password,
      };

      await tutorService.createTutor(tutorData);
      
      // Reload tutors
      await loadTutors();
      
      // Reset form and close dialog
      setFormData({
        name: '',
        email: '',
        contactNumber1: '',
        contactNumber2: '',
        password: '',
      });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Tutor creado",
        description: `El tutor ${formData.name} ha sido creado exitosamente.`,
      });
    } catch (error) {
      console.error('Error creating tutor:', error);
      setError('Error al crear tutor: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTutor = async (tutorId: string) => {
    const tutor = tutors.find(t => t.id === parseInt(tutorId));
    setSelectedTutor(tutor);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTutor = async () => {
    if (!selectedTutor) return;

    try {
      setIsSubmitting(true);
      
      await tutorService.deleteTutor(selectedTutor.id);
      
      // Reload tutors to get updated list from server
      await loadTutors();
      
      // Close dialog and clear selection
      setIsDeleteDialogOpen(false);
      setSelectedTutor(null);
      
      toast({
        title: "Tutor eliminado",
        description: `El tutor ${selectedTutor.nombre} ha sido eliminado exitosamente.`,
      });
    } catch (error) {
      console.error('Error deleting tutor:', error);
      setError('Error al eliminar tutor: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el tutor. Inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTutor = (tutor: any) => {
    console.log('Tutor data for editing:', tutor);
    setSelectedTutor(tutor);
    setEditFormData({
      name: tutor.nombre || '',
      email: tutor.email || '',
      contactNumber1: tutor.contactNumber1?.toString() || '',
      contactNumber2: tutor.contactNumber2?.toString() || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutor) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const updateData = {
        nombre: editFormData.name,
        email: editFormData.email,
        contactNumber1: editFormData.contactNumber1,
        contactNumber2: editFormData.contactNumber2,
      };

      await tutorService.updateTutor(selectedTutor.id, updateData);
      await loadTutors();
      setIsEditDialogOpen(false);
      setSelectedTutor(null);
      setEditFormData({
        name: '',
        email: '',
        contactNumber1: '',
        contactNumber2: '',
      });
      
      toast({
        title: "Tutor actualizado",
        description: `La información de ${editFormData.name} ha sido actualizada exitosamente.`,
      });
    } catch (error) {
      console.error('Error updating tutor:', error);
      setError('Error al actualizar tutor: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Tutores</h1>
          <p className="text-gray-600 mt-1">
            Agregar, editar y gestionar tutores del sistema académico.
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Tutor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nuevo Tutor</DialogTitle>
              <DialogDescription>
                Crear una nueva cuenta de tutor en el sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTutor} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ingrese el nombre completo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactNumber1">Teléfono principal</Label>
                <Input
                  id="contactNumber1"
                  type="tel"
                  required
                  value={formData.contactNumber1}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactNumber1: e.target.value }))}
                  placeholder="123456789"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactNumber2">Teléfono secundario (opcional)</Label>
                <Input
                  id="contactNumber2"
                  type="tel"
                  value={formData.contactNumber2}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactNumber2: e.target.value }))}
                  placeholder="987654321"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Contraseña del tutor"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    'Crear Tutor'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtrar tutores por nombre o email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar tutores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tutors Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Tutores ({filteredTutors.length})</CardTitle>
              <CardDescription>
                Lista de todos los tutores en el sistema.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Cargando tutores...</span>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-8 bg-red-50 rounded">
              {error}
              <Button 
                variant="outline" 
                className="ml-4" 
                onClick={loadTutors}
              >
                Reintentar
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTutors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                        No se encontraron tutores
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTutors.map((tutor) => (
                      <TableRow key={tutor.id}>
                        <TableCell className="font-medium">
                          {tutor.id}
                        </TableCell>
                        <TableCell>{tutor.nombre}</TableCell>
                        <TableCell>{tutor.email}</TableCell>
                        <TableCell>{tutor.contactNumber1}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditTutor(tutor)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTutor(tutor.id.toString())}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Tutor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Tutor</DialogTitle>
            <DialogDescription>
              Modifica la información del tutor seleccionado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTutor} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre completo</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del tutor"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Correo electrónico</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contact1">Número de contacto principal</Label>
              <Input
                id="edit-contact1"
                value={editFormData.contactNumber1}
                onChange={(e) => setEditFormData(prev => ({ ...prev, contactNumber1: e.target.value }))}
                placeholder="Número de teléfono"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contact2">Número de contacto secundario (opcional)</Label>
              <Input
                id="edit-contact2"
                value={editFormData.contactNumber2}
                onChange={(e) => setEditFormData(prev => ({ ...prev, contactNumber2: e.target.value }))}
                placeholder="Número de teléfono alternativo"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Tutor'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar al tutor "{selectedTutor?.nombre}"?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteTutor}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Tutor'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
