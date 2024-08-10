import Deploy from "./Deploy";
import Mint from "./Mint";
import useAuth from '../Auth/UseAuth';

const AdminPage = () => {
    const { signer } = useAuth();
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
