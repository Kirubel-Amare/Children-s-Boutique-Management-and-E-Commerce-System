// components/checkout/FormSection.tsx
interface FormSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, icon: Icon, children }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Icon className="h-5 w-5 text-pink-600 mr-2" />
        {title}
      </h3>
      {children}
    </div>
  );
};