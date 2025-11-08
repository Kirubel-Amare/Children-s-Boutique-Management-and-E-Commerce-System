// components/contact/ContactForm.tsx (updated)
import { useContactForm } from '@/hooks/useContactForm';
import { FormInput } from '@/components/checkout/FormInput';
import { SubmitButton } from '@/components/checkout/SubmitButton';
import { ErrorMessage } from '@/components/auth/ErrorMessage';
import { SuccessMessage } from '@/components/contact/SuccessMessage';

export const ContactForm: React.FC = () => {
  const {
    formData,
    loading,
    success,
    error,
    handleChange,
    handleSubmit,
  } = useContactForm();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      {success && (
        <SuccessMessage 
          message="Thank you for your message! We'll get back to you within 24 hours. A confirmation email has been sent to your inbox."
          onDismiss={() => {}}
        />
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          label="Full Name"
          required={true}
        />

        <FormInput
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          label="Email Address"
          required={true}
        />

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            value={formData.message}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
            placeholder="How can we help you? Please include any relevant details about your inquiry..."
          />
          <p className="text-sm text-gray-500 mt-2">
            Please provide as much detail as possible so we can better assist you.
          </p>
        </div>

        <ErrorMessage message={error} />

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-blue-800 font-medium">What to expect</p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• We typically respond within 24 hours</li>
                <li>• You'll receive a confirmation email immediately</li>
                <li>• For urgent matters, please call us directly</li>
              </ul>
            </div>
          </div>
        </div>

        <SubmitButton 
          loading={loading} 
          disabled={success}
          className="w-full bg-pink-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          {loading ? 'Sending Message...' : 'Send Message'}
        </SubmitButton>
      </form>
    </div>
  );
};