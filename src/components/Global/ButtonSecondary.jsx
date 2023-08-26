import { Link } from 'react-router-dom';

export function BtnSecondary({ txt, url }) {
    return <button to={url} className="btn-secondary">{txt}</button> 
}