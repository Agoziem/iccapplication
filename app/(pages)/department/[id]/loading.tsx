const Loading = () => {
    return (
      <div className='w-100 d-flex align-items-center'>
        {/* Boostrap Spinner */}
          <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Loading...</span>
          </div>
      </div>
    );
  };
  
  export default Loading;