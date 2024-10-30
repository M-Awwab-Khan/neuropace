import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Clock, Zap } from "lucide-react"

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-background py-20 sm:py-32">
            <div className="absolute inset-0 bg-grid-primary/[0.03] bg-[size:60px_60px]" />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
                    <div className="flex flex-col justify-center space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl xl:text-6xl/none">
                                Master Any Subject with Spaced Repetition
                            </h1>
                            <p className="text-lg text-muted-foreground sm:text-xl pt-5">
                                Boost your learning efficiency and retain information longer with our intelligent flashcard system.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button size="lg" className="w-full sm:w-auto">
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                How It Works
                            </Button>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-3">
                            {[
                                { icon: Brain, text: "Optimized Learning" },
                                { icon: Clock, text: "Time-Efficient" },
                                { icon: Zap, text: "Boost Retention" },
                            ].map(({ icon: Icon, text }, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Icon className="h-5 w-5 text-primary" />
                                    <span className="text-sm font-medium">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-center lg:justify-end">
                        <div className="relative w-full max-w-lg">
                            <div className="absolute -left-4 -top-4 h-72 w-72 animate-blob rounded-full bg-primary/30 mix-blend-multiply blur-3xl filter" />
                            <div className="animation-delay-2000 absolute -bottom-8 left-20 h-72 w-72 animate-blob rounded-full bg-secondary/30 mix-blend-multiply blur-2xl filter" />
                            <div className="animation-delay-4000 absolute -right-4 -top-4 h-72 w-72 animate-blob rounded-full bg-accent/30 mix-blend-multiply blur-2xl filter" />
                            <div className="relative space-y-4">
                                {[
                                    { question: "What is the capital of France?", answer: "Paris" },
                                    { question: "What is 7 x 8?", answer: "56" },
                                    { question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare" },
                                ].map((card, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg bg-card p-4 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <h3 className="font-semibold text-card-foreground">{card.question}</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">{card.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
