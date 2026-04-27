import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-500"></div>
              <span className="font-bold text-xl text-primary">Postulate</span>
            </Link>
            <p className="text-sm text-muted mt-2">
              The ultimate social media management operating system. Schedule, analyze, and engage all in one place.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-foreground">Product</h4>
            <Link href="#" className="text-sm text-muted hover:text-primary transition-colors">Features</Link>
            <Link href="#" className="text-sm text-muted hover:text-primary transition-colors">Pricing</Link>
            <Link href="#" className="text-sm text-muted hover:text-primary transition-colors">Integrations</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-foreground">Company</h4>
            <Link href="#" className="text-sm text-muted hover:text-primary transition-colors">About Us</Link>
            <Link href="#" className="text-sm text-muted hover:text-primary transition-colors">Blog</Link>
            <Link href="#" className="text-sm text-muted hover:text-primary transition-colors">Contact</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <Link href="#" className="text-sm text-muted hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Postulate Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-muted">
             {/* Placeholder for social icons */}
             <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
             <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
             <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
