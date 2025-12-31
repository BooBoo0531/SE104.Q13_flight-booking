import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log chi tiết lỗi để debug
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Đã xảy ra lỗi</h2>
            <p className="text-gray-600 mb-4">
              Ứng dụng gặp sự cố khi hiển thị. Vui lòng F5 để thử lại.
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                this.setState({ hasError: false, error: null });
              }}
            >
              Thử hiển thị lại
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
