// components/settings/PreferencesTab.tsx
export const PreferencesTab: React.FC = () => {
  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Application Preferences
      </h3>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-medium text-gray-900 mb-4">Coming Soon</h4>
          <p className="text-gray-600">
            User preferences and customization options will be available in a future update.
            This may include theme settings, notification preferences, and display options.
          </p>
        </div>
      </div>
    </div>
  );
};