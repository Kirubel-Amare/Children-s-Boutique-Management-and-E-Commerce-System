// components/checkout/ProgressSteps.tsx
interface ProgressStep {
  number: number;
  label: string;
  active: boolean;
}

interface ProgressStepsProps {
  steps: ProgressStep[];
  currentStep: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, currentStep }) => {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step.active 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-300 text-gray-600'
            } font-semibold`}>
              {step.number}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              step.active ? 'text-pink-600' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                step.active ? 'bg-pink-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};