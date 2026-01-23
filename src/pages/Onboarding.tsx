import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Goals", description: "What are you working toward?" },
  { id: 2, title: "Boundaries", description: "What do you want to avoid?" },
  { id: 3, title: "Preferences", description: "How should we filter for you?" },
  { id: 4, title: "Complete", description: "Your AI is ready" },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [shortTermGoals, setShortTermGoals] = useState("");
  const [longTermGoals, setLongTermGoals] = useState("");
  const [avoid, setAvoid] = useState("");
  const [riskTolerance, setRiskTolerance] = useState("medium");
  const [values, setValues] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // For now, we'll just navigate to dashboard
      // Profile saving will be implemented after DB setup
      toast({
        title: "Profile created!",
        description: "Your AI gatekeeper is now configured.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Steps indicator */}
      <div className="hidden lg:flex w-80 border-r border-border/50 flex-col p-8">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">L</span>
          </div>
          <span className="text-xl font-serif font-semibold">LifeOS</span>
        </div>

        <div className="flex-1">
          {steps.map((step, index) => (
            <div key={step.id} className="flex gap-4 mb-8">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "bg-primary/20 border-2 border-primary text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 mt-2 transition-colors duration-300 ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
              <div className="pt-2">
                <h3
                  className={`font-medium transition-colors ${
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Form content */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
        <div className="max-w-xl w-full mx-auto">
          {/* Mobile step indicator */}
          <div className="lg:hidden flex items-center justify-between mb-8">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <div className="flex gap-1.5">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`h-1.5 w-8 rounded-full transition-colors ${
                    currentStep >= step.id ? "bg-primary" : "bg-secondary"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Goals */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-serif font-bold mb-2">
                What are you working toward?
              </h1>
              <p className="text-muted-foreground mb-8">
                Help us understand your priorities so we can filter opportunities that align.
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="shortTerm">Short-term goals (3-12 months)</Label>
                  <Textarea
                    id="shortTerm"
                    placeholder="e.g., Launch my SaaS product, get 1000 users, close a funding round..."
                    value={shortTermGoals}
                    onChange={(e) => setShortTermGoals(e.target.value)}
                    className="min-h-[120px] bg-secondary border-border resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longTerm">Long-term vision (3-5 years)</Label>
                  <Textarea
                    id="longTerm"
                    placeholder="e.g., Build a billion-dollar company, achieve financial freedom, become an industry thought leader..."
                    value={longTermGoals}
                    onChange={(e) => setLongTermGoals(e.target.value)}
                    className="min-h-[120px] bg-secondary border-border resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Boundaries */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-serif font-bold mb-2">
                What do you want to avoid?
              </h1>
              <p className="text-muted-foreground mb-8">
                Tell us what to filter out. We'll protect you from these distractions.
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="avoid">Things to avoid</Label>
                  <Textarea
                    id="avoid"
                    placeholder="e.g., Unpaid speaking requests, cold sales pitches, networking for networking's sake, projects under $10k..."
                    value={avoid}
                    onChange={(e) => setAvoid(e.target.value)}
                    className="min-h-[180px] bg-secondary border-border resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-serif font-bold mb-2">
                Your filtering preferences
              </h1>
              <p className="text-muted-foreground mb-8">
                Fine-tune how aggressive the AI should be in filtering.
              </p>

              <div className="space-y-8">
                <div className="space-y-4">
                  <Label>Risk tolerance</Label>
                  <RadioGroup value={riskTolerance} onValueChange={setRiskTolerance}>
                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/50 border border-border/50 hover:border-border transition-colors">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low" className="flex-1 cursor-pointer">
                        <span className="font-medium">Conservative</span>
                        <p className="text-sm text-muted-foreground">
                          Show me most things, let me decide
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/50 border border-border/50 hover:border-border transition-colors">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="flex-1 cursor-pointer">
                        <span className="font-medium">Balanced</span>
                        <p className="text-sm text-muted-foreground">
                          Filter obvious noise, escalate uncertain ones
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/50 border border-border/50 hover:border-border transition-colors">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="flex-1 cursor-pointer">
                        <span className="font-medium">Aggressive</span>
                        <p className="text-sm text-muted-foreground">
                          Only show high-confidence opportunities
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="values">Core values (ranked by importance)</Label>
                  <Textarea
                    id="values"
                    placeholder="e.g., 1. Freedom, 2. Impact, 3. Wealth, 4. Recognition, 5. Learning..."
                    value={values}
                    onChange={(e) => setValues(e.target.value)}
                    className="min-h-[120px] bg-secondary border-border resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 4 && (
            <div className="animate-fade-in text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-8 shadow-gold-lg animate-glow-pulse">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>

              <h1 className="text-3xl font-serif font-bold mb-4">
                Your AI Gatekeeper is Ready
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Based on your decision profile, we'll now filter all incoming 
                opportunities and only show you what truly aligns with your goals.
              </p>

              <div className="bg-card rounded-2xl border border-border/50 p-6 mb-8 text-left max-w-md mx-auto">
                <h3 className="font-semibold mb-4">Your Decision Profile Summary</h3>
                <div className="space-y-3 text-sm">
                  {shortTermGoals && (
                    <div>
                      <span className="text-muted-foreground">Short-term focus:</span>
                      <p className="text-foreground line-clamp-2">{shortTermGoals}</p>
                    </div>
                  )}
                  {longTermGoals && (
                    <div>
                      <span className="text-muted-foreground">Long-term vision:</span>
                      <p className="text-foreground line-clamp-2">{longTermGoals}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Filtering mode:</span>
                    <p className="text-foreground capitalize">{riskTolerance}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            {currentStep > 1 && currentStep < 4 ? (
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button variant="hero" onClick={handleNext}>
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="hero"
                size="lg"
                onClick={handleComplete}
                disabled={loading}
                className="mx-auto"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
