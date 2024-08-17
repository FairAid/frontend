import Deploy from "./Deploy";
import Mint from "./Mint";
import ListOfIDs from "./IDlist";
import '../../App.css';
import '../../styles/UserPage.css'; 

const AdminPage = ({signer}) => {
    return (
        <div style={{padding: "30px"}}>
            <h1>Manage IDs</h1>
            <div style={{ float: "left", padding: '20px', fontSize: '30px' }}>
                <Deploy signer={signer}/>
            </div>
            <div style={{ float: "right", padding: '20px', fontSize: '15px' }}>
                <Mint signer={signer}/>
            </div>
            <div style={{ padding: '100px', fontSize: '15px' }}>
                <ListOfIDs signer={signer}/>
            </div>
        </div>
    );
};

export default AdminPage;
