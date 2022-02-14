import "./client.css";

const ClientMsg = ({ username, text }) => {
  const splitUser = username.split("")[0].toUpperCase();
  return (
    <div className="cli-msg" key={Math.random()}>
      <div className="text-bubble">
        <div className="text">{text}</div>
        <div className="circle">{splitUser}</div>
      </div>
    </div>
  );
};

export default ClientMsg;
