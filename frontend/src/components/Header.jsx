import React from 'react';
import DropdownMenu from './DropDown.jsx';
import SearchBar from './SearchBar';
import './styles/Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleSelect = (item) => {
    const symbol = item.replace(/\s+/g, '').toUpperCase();
    navigate(`/stock/${symbol}`);
  };

  return (
    <header className="header">
      <h1 className="logo">📈 Indian Markets</h1>
      <nav className="nav">
        <DropdownMenu 
          title="Index" 
          items={['Nifty 50', 'Bank Nifty', 'Nifty MIDCAP', 'Nifty Auto', 'Nifty Finance']}
          onSelect={handleSelect}
        />
        <DropdownMenu 
          title="Stocks" 
          items={['Reliance', 'Airtel', 'ONGC', 'Adani Enterprises', 'Adani Port', 'Infosys', 'HDFC Bank', 'Axis Bank', 'Bajaj Finance', 'SBI Bank']}
          onSelect={handleSelect}
          />
        <SearchBar />
      </nav>
    </header>
  );
};

export default Header;
