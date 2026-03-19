const Toast = ({ message }) => {
  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "#333",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "5px"
    }}>
      {message}
    </div>
  );
};

export default Toast;