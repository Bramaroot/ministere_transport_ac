export function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-6">
        <div className="text-center text-sm text-muted-foreground">
          <p className="font-medium mb-1">
            Ministère des Transports et de l'Aviation Civile
          </p>
          <p>© {currentYear} République du Niger - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;
