import React, { useContext } from "react";
import { InjectedRouter } from "react-router";

import PATHS from "router/paths";
import configAPI from "services/entities/config";
import { NotificationContext } from "context/notification";
import { AppContext } from "context/app";

import MainContent from "components/MainContent/MainContent";
import Button from "components/buttons/Button";
import BackLink from "components/BackLink/BackLink";

const baseClass = "windows-mdm-page";

interface ISetWindowsMdmOptions {
  enable: boolean;
  successMessage: string;
  errorMessage: string;
  router: InjectedRouter;
}

const useSetWindowsMdm = ({
  enable,
  successMessage,
  errorMessage,
  router,
}: ISetWindowsMdmOptions) => {
  const { setConfig } = useContext(AppContext);
  const { renderFlash } = useContext(NotificationContext);

  const turnOnWindowsMdm = async () => {
    try {
      const updatedConfig = await configAPI.update({
        mdm: {
          windows_enabled_and_configured: enable,
        },
      });
      setConfig(updatedConfig);
      renderFlash("success", successMessage);
    } catch {
      renderFlash("error", errorMessage);
    } finally {
      router.push(PATHS.ADMIN_INTEGRATIONS_MDM);
    }
  };

  return turnOnWindowsMdm;
};

interface IWindowsMdmOnContentProps {
  router: InjectedRouter;
}

const WindowsMdmOnContent = ({ router }: IWindowsMdmOnContentProps) => {
  const turnOnWindowsMdm = useSetWindowsMdm({
    enable: true,
    successMessage: "Windows MDM turned on (servers excluded).",
    errorMessage: "Unable to turn on Windows MDM. Please try again.",
    router,
  });

  return (
    <>
      <h1>Turn on Windows MDM</h1>
      <p>
        This will turn MDM on for Windows hosts with fleetd, overriding existing
        MDM solutions.
      </p>
      <p>MDM won&apos;t be turned on for Windows servers</p>
      <Button onClick={turnOnWindowsMdm}>Turn on</Button>
    </>
  );
};

interface IWindowsMdmOffContentProps {
  router: InjectedRouter;
}

const WindowsMdmOffContent = ({ router }: IWindowsMdmOffContentProps) => {
  const turnOffWindowsMdm = useSetWindowsMdm({
    enable: false,
    successMessage: "Windows MDM turned off.",
    errorMessage: "Unable to turn off Windows MDM. Please try again.",
    router,
  });

  return (
    <>
      <h1>Turn off Windows MDM</h1>
      <p>This will turn off MDM on each Windows host.</p>
      <Button onClick={turnOffWindowsMdm}>Turn off MDM</Button>
    </>
  );
};

interface IWindowsMdmPageProps {
  router: InjectedRouter;
}

const WindowsMdmPage = ({ router }: IWindowsMdmPageProps) => {
  const { config } = useContext(AppContext);

  // TODO: remove when windows MDM is fully released. This is a temporary redirect
  // when the feature is not enabled.
  if (!config?.mdm_enabled) {
    router.replace(PATHS.ADMIN_INTEGRATIONS_MDM);
  }

  const isWindowsMdmEnabled =
    config?.mdm?.windows_enabled_and_configured ?? false;

  return (
    <MainContent className={baseClass}>
      <>
        <BackLink
          text="Back to MDM"
          path={PATHS.ADMIN_INTEGRATIONS_MDM}
          className={`${baseClass}__back-to-mdm`}
        />
        {isWindowsMdmEnabled ? (
          <WindowsMdmOffContent router={router} />
        ) : (
          <WindowsMdmOnContent router={router} />
        )}
      </>
    </MainContent>
  );
};

export default WindowsMdmPage;
