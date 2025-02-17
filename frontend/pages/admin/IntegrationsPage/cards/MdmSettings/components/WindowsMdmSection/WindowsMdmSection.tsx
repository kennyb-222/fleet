import React, { useContext } from "react";

import { AppContext } from "context/app";

import Card from "components/Card/Card";
import Button from "components/buttons/Button";
import Icon from "components/Icon";

const baseClass = "windows-mdm-section";

interface ITurnOnWindowsMdmProps {
  onClickTurnOn: () => void;
}
const TurnOnWindowsMdm = ({ onClickTurnOn }: ITurnOnWindowsMdmProps) => {
  return (
    <div className={`${baseClass}__turn-on-windows`}>
      <div className={`${baseClass}__`}>
        <h3>Turn on Windows MDM</h3>
        <p>Turn MDM on for Windows hosts with fleetd.</p>
      </div>
      <Button onClick={onClickTurnOn}>Turn on</Button>
    </div>
  );
};

interface ITurnOffWindowsMdmProps {
  onClickEdit: () => void;
}

const TurnOffWindowsMdm = ({ onClickEdit }: ITurnOffWindowsMdmProps) => {
  return (
    <div className={`${baseClass}__turn-off-windows`}>
      <div>
        <Icon name="success" />
        <p>Windows MDM turned on (servers excluded).</p>
      </div>
      <Button onClick={onClickEdit} variant="text-icon">
        <Icon name="pencil" />
        Edit
      </Button>
    </div>
  );
};

interface IWindowsMdmSectionProps {
  turnOnWindowsMdm: () => void;
  editWindowsMdm: () => void;
}

const WindowsMdmSection = ({
  turnOnWindowsMdm,
  editWindowsMdm,
}: IWindowsMdmSectionProps) => {
  const { config } = useContext(AppContext);

  const isWindowsMdmEnabled =
    config?.mdm?.windows_enabled_and_configured ?? false;

  return (
    <Card className={baseClass} color="gray">
      {isWindowsMdmEnabled ? (
        <TurnOffWindowsMdm onClickEdit={editWindowsMdm} />
      ) : (
        <TurnOnWindowsMdm onClickTurnOn={turnOnWindowsMdm} />
      )}
    </Card>
  );
};

export default WindowsMdmSection;
