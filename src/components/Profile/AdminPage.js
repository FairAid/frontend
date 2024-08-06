import Deploy from "./Deploy";
import Mint from "./Mint";

const AdminPage = () => {
    return (
        <div>
            <div style={{ float: "left", padding: '20px', fontSize: '30px' }}>
                <Deploy />
            </div>
            <div style={{ float: "right", padding: '20px', fontSize: '30px' }}>
                <Mint />
            </div>
        </div>
    );
};

export default AdminPage;
