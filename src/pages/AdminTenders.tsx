import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminFooter } from "@/components/AdminFooter";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminTenders = () => {
  const navigate = useNavigate();

  const tendersData = [
    {
      id: 1,
      title: "Construction autoroute Niamey-Maradi",
      type: "Travaux",
      deadline: "2024-04-30",
      status: "Ouvert",
      budget: "50M FCFA",
    },
    {
      id: 2,
      title: "Fourniture équipements aviation",
      type: "Fourniture",
      deadline: "2024-05-15",
      status: "En cours",
      budget: "25M FCFA",
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <main className="flex-1 bg-muted/30">
            <div className="glass-card border-b sticky top-0 z-40 mb-8">
              <div className="container py-4">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-xl font-bold">Gestion des Appels d'Offres</h1>
                    <p className="text-sm text-muted-foreground">
                      Créer et gérer les appels d'offres
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="container py-8">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Appels d'Offres</h2>
                  <p className="text-muted-foreground">
                    {tendersData.length} appels d'offres actifs
                  </p>
                </div>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Nouvel Appel d'Offres
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Liste des Appels d'Offres</CardTitle>
                  <CardDescription>
                    Gérez tous vos appels d'offres
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date Limite</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tendersData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.title}
                          </TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.deadline}</TableCell>
                          <TableCell>{item.budget}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "Ouvert"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>

          <AdminFooter />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminTenders;
