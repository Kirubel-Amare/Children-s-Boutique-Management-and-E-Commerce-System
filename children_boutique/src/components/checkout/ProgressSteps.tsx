"use client";

interface Step {
  number: number;
  label: string;
  active: boolean;
}

export function ProgressSteps({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) {
  return (
    <div className="w-full flex items-center justify-center my-4 sm:my-8">
      <div className="flex items-center w-full max-w-sm sm:max-w-xl justify-between">
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep;
          const isActive = index + 1 === currentStep;

          return (
            <div
              key={step.number}
              className="flex flex-col items-center w-full relative"
            >
              {/* Circle */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border text-sm font-medium z-10
                  ${
                    isCompleted
                      ? "bg-black text-white border-black"
                      : isActive
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-500 border-gray-300"
                  }`}
              >
                {step.number}
              </div>

              {/* Label (desktop only) */}
              <span className="hidden sm:block text-sm mt-2 text-gray-700">
                {step.label}
              </span>

              {/* Line between circles */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-1 
                    ${
                      isCompleted
                        ? "bg-black"
                        : "bg-gray-300"
                    }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
