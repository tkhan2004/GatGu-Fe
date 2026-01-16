import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';

export default function VehicleSetup() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display transition-colors duration-200 min-h-screen flex flex-col overflow-x-hidden">
            <Navbar variant="registration" />

            <main className="flex-1 w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
                <div className="w-full lg:w-5/12 xl:w-1/3 flex flex-col h-full overflow-y-auto custom-scrollbar bg-background-light dark:bg-background-dark relative z-10">
                    <div className="px-6 py-8 md:px-12 md:py-12 flex flex-col flex-1 max-w-lg mx-auto lg:mx-0 w-full">
                        <div className="flex flex-col gap-2 mb-8">
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-primary font-bold">Step 3 of 3</span>
                                <span className="text-slate-500 dark:text-slate-400">100% Completed</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>

                        <div className="mb-8 animate-fade-in-up">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                                Vehicle Setup
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                                Help us identify your vehicle and keep you safe. These details are optional but recommended.
                            </p>
                        </div>

                        <form className="flex flex-col gap-6 flex-1">
                            <div className="space-y-2 group">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300" htmlFor="license-plate">
                                    License Plate Number
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-slate-400 dark:text-white uppercase"
                                        id="license-plate"
                                        placeholder="29A-123.45"
                                        type="text"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        <span className="material-symbols-outlined">featured_play_list</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Vehicle Photo <span className="font-normal text-slate-400 ml-1">(Optional)</span>
                                </label>
                                <div className="w-full h-40 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-surface-light dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-primary transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center group relative overflow-hidden">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform z-10">
                                        <span className="material-symbols-outlined">add_a_photo</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white z-10">Click to upload or drag & drop</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 z-10">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300" htmlFor="emergency-contact">
                                    Emergency Contact Phone
                                </label>
                                <div className="relative flex">
                                    <div className="h-14 w-20 bg-surface-light dark:bg-surface-dark border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium border-r-slate-200 dark:border-r-slate-700">
                                        🇻🇳 +84
                                    </div>
                                    <input
                                        className="flex-1 h-14 pl-4 pr-4 rounded-r-xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-slate-400 dark:text-white"
                                        id="emergency-contact"
                                        placeholder="90 123 4567"
                                        type="tel"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">shield</span>
                                    We'll only contact this number in case of emergency.
                                </p>
                            </div>

                            <div className="pt-6 mt-auto">
                                <Link to="/monitoring">
                                    <Button className="w-full group" size="lg">
                                        <span>Complete Registration</span>
                                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform ml-2">arrow_forward</span>
                                    </Button>
                                </Link>
                                <div className="mt-4 text-center">
                                    <a className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors" href="#">
                                        Skip this step for now
                                    </a>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="lg:hidden w-full h-32 bg-slate-100 dark:bg-surface-dark mt-6 overflow-hidden relative">
                        <img alt="Driving" className="w-full h-full object-cover opacity-60 dark:opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6osn6t2O_zxbFlTNscNCEBY7OqgaZskK31QVOPUj6rf68p586YRF9hsg0fL3ZenC06D2PkRWsoji9PA2EbbIKYflbrpCJzn5GkQPyPCk6p-xTj8eXgMm1d1V6YrPGe6ESdzCmlDeVn3J1XbIzAIySA5YFs2M6q3zyfG3n1hjGTSrHAddwj30RtwGl3bbAOJclUAXFxLk1K-IFpBqkAw1matRT41KMFTaZNsd59_zwFOON1nfl68dNU1rpdhhaj8QJVPmf0BKbXQnk" />
                    </div>
                </div>

                <div className="hidden lg:block w-7/12 xl:w-2/3 bg-surface-light dark:bg-surface-dark relative p-4 h-full">
                    <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-inner group">
                        <img alt="Scenic Drive" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG-_rAJ6EofmrDI7euFJDFEvGDcdS8gBW32887vG6GSe3_vFiYp7aW8-1S9s-aVeyUwcT_lsikaam6N4Ky8yYk0wzy5-KPZgj2dEymDkvd9GFHsGAkH4fkae6f-8ZyxOcmvNoDzg3Eu8e-CiYgdW7xU8mrrBbQTqcwNkyVsstCjlm1UwWZSiPLBxlc6X_JImxl20ckoGFhSIEbQpKyZokfVIgvBdXfzm4F9wEm5ud0jiqKmLp0BMLp8_VoYH9vN8I7kKSoP46-1ghw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                        <div className="absolute bottom-12 left-12 right-12 z-10 flex flex-col gap-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 w-fit mb-4">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                <span className="text-xs font-semibold text-white tracking-wide uppercase">Safety First</span>
                            </div>
                            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                                Your safety is our<br />
                                <span className="text-primary-300">top priority.</span>
                            </h2>
                            <p className="text-slate-300 mt-2 max-w-md text-lg">
                                Gật Gù helps monitor your alertness and keeps your emergency contacts informed when it matters most.
                            </p>
                        </div>
                        <div className="absolute top-10 right-10 w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center backdrop-blur-sm animate-[spin_10s_linear_infinite]">
                            <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white/60"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
