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
import { Plus, Search, Edit, Trash2, UserCheck, UserX, Loader2 } from 'lucide-react';
import { participantService } from '@/services/participant.service';
import { DepartmentService, Department } from '@/services/department.service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function ParticipantsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [participants, setParticipants] = useState<any[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber1: '',
    contactNumber2: '',
    departamento_id: '1',
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    contactNumber1: '',
    contactNumber2: '',
    departamento_id: '1',
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      loadParticipants();
      loadDepartments();
    }
  }, [user]);

  const loadDepartments = async () => {
    try {
      const apiDepartments = await DepartmentService.getAllDepartments();
      setDepartments(apiDepartments);
    } catch (error) {
      console.error('Error loading departments:', error);
      // Don't show error for departments as it's not critical
    }
  };

  const loadParticipants = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiParticipants = await participantService.getAllParticipants();
      setParticipants(apiParticipants);
    } catch (error) {
      console.error('Error loading participants:', error);
      setError('Error al cargar participantes: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && participant.activo) ||
                         (statusFilter === 'inactive' && !participant.activo);
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const participantData = {
        nombre: formData.name,
        email: formData.email,
        contactNumber1: formData.contactNumber1,
        contactNumber2: formData.contactNumber2,
        departamentoId: parseInt(formData.departamento_id),
      };

      await participantService.createParticipant(participantData);
      
      // Reload participants
      await loadParticipants();
      
      // Reset form and close dialog
      setFormData({
        name: '',
        email: '',
        contactNumber1: '',
        contactNumber2: '',
        departamento_id: '1',
      });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Participante creado",
        description: `El participante ${formData.name} ha sido creado exitosamente.`,
      });
    } catch (error) {
      console.error('Error creating participant:', error);
      setError('Error al crear participante: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteParticipant = async (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    setSelectedParticipant(participant);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteParticipant = async () => {
    if (!selectedParticipant) return;

    try {
      setIsSubmitting(true);
      
      // Call the delete API - it returns 204 No Content on success
      await participantService.deleteParticipant(selectedParticipant.id);
      
      // Reload participants to get updated list from server
      await loadParticipants();
      
      // Close dialog and clear selection
      setIsDeleteDialogOpen(false);
      setSelectedParticipant(null);
      
      toast({
        title: "Participante eliminado",
        description: `El participante ${selectedParticipant.nombre} ha sido eliminado exitosamente.`,
      });
    } catch (error) {
      console.error('Error deleting participant:', error);
      setError('Error al eliminar participante: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el participante. Inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditParticipant = (participant: any) => {
    console.log('Participant data for editing:', participant);
    setSelectedParticipant(participant);
    setEditFormData({
      name: participant.nombre || '',
      email: participant.email || '',
      contactNumber1: participant.contactNumber1?.toString() || '',
      contactNumber2: participant.contactNumber2?.toString() || '',
      departamento_id: participant.departamentoId?.toString() || '1',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipant) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const updateData = {
        nombre: editFormData.name,
        email: editFormData.email,
        contactNumber1: editFormData.contactNumber1,
        contactNumber2: editFormData.contactNumber2,
        departamentoId: parseInt(editFormData.departamento_id),
      };

      await participantService.updateParticipant(selectedParticipant.id, updateData);
      await loadParticipants();
      setIsEditDialogOpen(false);
      setSelectedParticipant(null);
      setEditFormData({
        name: '',
        email: '',
        contactNumber1: '',
        contactNumber2: '',
        departamento_id: '1',
      });
      
      toast({
        title: "Participante actualizado",
        description: `La información de ${editFormData.name} ha sido actualizada exitosamente.`,
      });
    } catch (error) {
      console.error('Error updating participant:', error);
      setError('Error al actualizar participante: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleParticipantStatus = async (id: string) => {
    try {
      const participant = participants.find(p => p.id === parseInt(id));
      if (!participant) return;
      
      const newStatus = !participant.activo;
      
      // Use the updateParticipant endpoint with activo field
      await participantService.updateParticipant(parseInt(id), { activo: newStatus });
      
      // Update local state after successful API call
      setParticipants(prev => 
        prev.map(participant =>
          participant.id === id 
            ? { ...participant, activo: newStatus }
            : participant
        )
      );
      
      toast({
        title: "Estado actualizado",
        description: `El participante ha sido ${newStatus ? 'habilitado' : 'inhabilitado'} exitosamente.`,
      });
    } catch (error) {
      console.error('Error toggling participant status:', error);
      setError('Error al cambiar el estado del participante: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cambiar el estado del participante.",
      });
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Participantes</h1>
          <p className="text-gray-600 mt-1">
            Agregar, editar y gestionar participantes estudiantes en el sistema.
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Participante
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nuevo Participante</DialogTitle>
              <DialogDescription>
                Crear una nueva cuenta de participante en el sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateParticipant} className="space-y-4">
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
                <Label htmlFor="departamento">Departamento</Label>
                <Select 
                  value={formData.departamento_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, departamento_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id.toString()}>
                        {department.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    'Crear Participante'
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
            Filtrar participantes por nombre, email, ID de estudiante o estado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar participantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Participantes</SelectItem>
                  <SelectItem value="active">Solo Activos</SelectItem>
                  <SelectItem value="inactive">Solo Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Participantes ({filteredParticipants.length})</CardTitle>
              <CardDescription>
                Lista de todos los participantes en el sistema.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Cargando participantes...</span>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-8 bg-red-50 rounded">
              {error}
              <Button 
                variant="outline" 
                className="ml-4" 
                onClick={loadParticipants}
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
                    <TableHead>Departamento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParticipants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                        No se encontraron participantes
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredParticipants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell className="font-medium">
                          {participant.id}
                        </TableCell>
                        <TableCell>{participant.nombre}</TableCell>
                        <TableCell>{participant.email}</TableCell>
                        <TableCell>{participant.contactNumber1}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {departments.find(d => d.id === participant.departamentoId)?.nombre || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={participant.activo ? "default" : "secondary"}
                            className={participant.activo ? "bg-green-100 text-green-800" : ""}
                          >
                            {participant.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditParticipant(participant)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleParticipantStatus(participant.id.toString())}
                            >
                              {participant.activo ? (
                                <UserX className="h-4 w-4" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteParticipant(participant.id.toString())}
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

      {/* Edit Participant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Participante</DialogTitle>
            <DialogDescription>
              Modifica la información del participante seleccionado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateParticipant} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre completo</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del participante"
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
            <div className="space-y-2">
              <Label htmlFor="edit-department">Departamento</Label>
              <Select 
                value={editFormData.departamento_id} 
                onValueChange={(value) => setEditFormData(prev => ({ ...prev, departamento_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id.toString()}>
                      {department.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  'Actualizar Participante'
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
              ¿Estás seguro de que quieres eliminar al participante "{selectedParticipant?.nombre}"?
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
              onClick={confirmDeleteParticipant}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Participante'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
