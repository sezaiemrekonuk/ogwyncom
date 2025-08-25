const ErrorMessage = ({ error, onRetry, className = '' }) => {
  return (
    <div className={`error-message ${className}`}>
      <div className="error-content">
        <p className="error-text">
          {error || 'Bir hata oluştu. Lütfen tekrar deneyin.'}
        </p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="error-retry-button"
          >
            Tekrar Dene
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;