import { FaWhatsapp } from "react-icons/fa";

export function TechnicianButton() {
    return (
        <button
            onClick={() => window.open("https://wa.me/447454796398", "_blank")}
            className="group/secondary inline-flex items-center justify-center gap-3 rounded-xl cursor-pointer border-2 border-slate-300 bg-white px-7 py-4 text-[15px] font-medium text-slate-900 hover:border-primary/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:scale-[1.02]"
        >
            <span>Speak to a technician</span>

            <FaWhatsapp className="h-5 w-5 text-slate-500 group-hover/secondary:text-primary transition-colors" />
        </button>
    );
}
