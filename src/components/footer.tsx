export function Footer() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-center text-sm text-foreground/50">
        <p>&copy; {new Date().getFullYear()} Blog. All rights reserved.</p>
      </div>
    </footer>
  );
}
