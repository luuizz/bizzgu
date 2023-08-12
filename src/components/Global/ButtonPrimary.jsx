import { Link } from 'react-router-dom';

export function BtnPrimary({ txt, url }) {
    return <Link to={url} className="btn-primary">{txt}</Link> 
}
