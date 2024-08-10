import Deploy from "./Deploy";
import Mint from "./Mint";

const AdminPage = ({signer}) => {
    return (
        <div>
            <div style={{ float: "left", padding: '20px', fontSize: '30px' }}>
                <Deploy signer={signer}/>
            </div>
            <div style={{ float: "left", padding: '20px', fontSize: '15px' }}>
                <Mint signer={signer}/>
            </div>
        </div>
    );
};

export default AdminPage;
