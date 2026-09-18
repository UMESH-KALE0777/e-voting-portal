const PageTitle = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-12">

      <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
        {title}
      </h1>

      {subtitle && (
        <p className="text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}

    </div>
  );
};

export default PageTitle;