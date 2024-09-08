import { FileText, Calendar, MessageSquare } from "lucide-react";

export default function CertificatePage() {
  return (
    <main className="md:p-10">
      <div className="w-full bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
          Certificate
        </h1>
        <div className="space-y-10">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-start space-x-4">
              <FileText className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8" />
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Medical Certificate
                </h2>
                <p className="text-gray-600">
                  Request your medical certificate online with ease.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Calendar className="text-green-500 w-6 h-6 sm:w-8 sm:h-8" />
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Date of Consultation
                </h2>
                <p className="text-gray-600">
                  Specify the date when the consultation took place.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <MessageSquare className="text-yellow-500 w-6 h-6 sm:w-8 sm:h-8" />
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Reason for Request
                </h2>
                <p className="text-gray-600">
                  Provide a brief description of why you need the certificate.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Request Certificate
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              View Previous Requests
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
