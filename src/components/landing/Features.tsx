import { Brain, Filter, MessageSquare, Zap, Eye, Lock } from "lucide-react";

const features = [
  {
    icon: Filter,
    title: "Intelligent Filtering",
    description: "AI classifies every inbound message into ignore, review, or escalate based on your unique decision profile.",
  },
  {
    icon: Brain,
    title: "Decision Profile",
    description: "Define your goals, values, and boundaries. The AI learns what truly matters to you and filters accordingly.",
  },
  {
    icon: Zap,
    title: "High-Leverage Focus",
    description: "Only see opportunities that align with your short and long-term objectives. No more noise.",
  },
  {
    icon: MessageSquare,
    title: "Smart Auto-Responses",
    description: "Polite, customizable auto-replies handle low-priority requests while you focus on what matters.",
  },
  {
    icon: Eye,
    title: "Executive Dashboard",
    description: "Clean, calm interface showing today's top opportunities with AI reasoning and suggested actions.",
  },
  {
    icon: Lock,
    title: "Privacy-First",
    description: "Your data is encrypted, GDPR compliant, and never shared. You control what the AI sees.",
  },
];

export function Features() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
      
      <div className="container relative z-10 px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            <span className="text-foreground">How</span>{" "}
            <span className="text-gradient-gold">LifeOS</span>{" "}
            <span className="text-foreground">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A new operating system for life. Not another productivity app—
            a decision infrastructure that protects your most valuable resource: attention.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-card animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 font-serif">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
