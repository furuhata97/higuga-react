import React, { HTMLAttributes } from 'react';

import {
  FiMap,
  FiHome,
  FiCompass,
  FiShoppingBag,
  FiClock,
} from 'react-icons/fi';
import logo from '../../assets/higugaLogo.svg';

import {
  Footer,
  FooterContent,
  FooterAddress,
  VerticalBar,
  FooterAttendance,
} from './styles';

type HeaderProps = HTMLAttributes<HTMLElement>;

const FooterNav: React.FC<HeaderProps> = () => {
  return (
    <Footer>
      <FooterContent>
        <div>
          <FooterAddress>
            <p>Rua Antonio Vieira de Brito, 96</p>
            <FiMap />
          </FooterAddress>
          <FooterAddress>
            <p>Lobato - PR</p>
            <FiHome />
          </FooterAddress>
          <FooterAddress>
            <p>86790-000</p>
            <FiCompass />
          </FooterAddress>
        </div>
        <VerticalBar />
        <div>
          <img src={logo} alt="Logo do Higuga" />
        </div>
        <VerticalBar />
        <div>
          <FooterAttendance>
            <FiShoppingBag />
            <p>Atendimento todos os dias</p>
          </FooterAttendance>
          <FooterAttendance>
            <FiClock />
            <p>Das 08h às 23h</p>
          </FooterAttendance>
        </div>
      </FooterContent>
    </Footer>
  );
};

export default FooterNav;
