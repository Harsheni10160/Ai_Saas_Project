import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-zinc-50 border-t border-zinc-200 pt-16 pb-8 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-1">
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">AI</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-zinc-900">
                            Docxbot
                        </span>
                    </Link>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                        Intelligent support automation for modern teams.
                        Trained on your data, available 24/7.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors">
                            <Twitter size={18} />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors">
                            <Github size={18} />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors">
                            <Linkedin size={18} />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-zinc-900 mb-4">Product</h4>
                    <ul className="space-y-3 text-sm text-zinc-600">
                        <li><Link href="#features" className="hover:text-zinc-900 hover:underline">Features</Link></li>
                        <li><Link href="#pricing" className="hover:text-zinc-900 hover:underline">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-zinc-900 hover:underline">Integrations</Link></li>
                        <li><Link href="#" className="hover:text-zinc-900 hover:underline">Changelog</Link></li>
                        <li><Link href="#" className="hover:text-zinc-900 hover:underline">Docs</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-zinc-900 mb-4">Company</h4>
                    <ul className="space-y-3 text-sm text-zinc-600">
                        <li><Link href="#" className="hover:text-zinc-900 hover:underline">About Us</Link></li>
                        <li><Link href="#" className="hover:text-zinc-900 hover:underline">Careers</Link></li>
                        <li><Link href="#" className="hover:text-zinc-900 hover:underline">Blog</Link></li>
                        <li><Link href="#" className="hover:text-zinc-900 hover:underline">Contact</Link></li>
                        <li><Link href="#" className="hover:text-zinc-900 hover:underline">Partners</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-zinc-900 mb-4">Legal</h4>
                    <ul className="space-y-3 text-sm text-zinc-600">
                        <li><Link href="#" className="hover:text-zinc-900 hover:underline">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-zinc-900 hover:underline">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-zinc-900 hover:underline">Security</Link></li>
                        <li><Link href="#" className="hover:text-zinc-900 hover:underline">Cookie Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-6xl mx-auto pt-8 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
                <div>© 2026 AI Support Docxbot. All rights reserved.</div>
                <div className="flex gap-6 font-medium">
                    <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        All Systems Operational
                    </span>
                </div>
            </div>
        </footer>
    );
}
