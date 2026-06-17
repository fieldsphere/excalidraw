import clsx from "clsx";

import { useTunnels } from "../../context/tunnels";
import { useUIAppState } from "../../context/ui-appState";
import { t } from "../../i18n";
import { useExcalidrawElements } from "../App";

import "./FooterCenter.scss";

const FooterCenter = ({ children }: { children?: React.ReactNode }) => {
  const { FooterCenterTunnel } = useTunnels();
  const appState = useUIAppState();
  const elements = useExcalidrawElements();
  const elementCount = elements.length;

  return (
    <FooterCenterTunnel.In>
      <div
        className={clsx("footer-center zen-mode-transition", {
          "layer-ui__wrapper__footer-left--transition-bottom":
            appState.zenModeEnabled,
        })}
      >
        <span
          className="footer-center__element-count"
          aria-label={t("footer.elementCount", { count: elementCount })}
        >
          {t("footer.elementCount", { count: elementCount })}
        </span>
        {children}
      </div>
    </FooterCenterTunnel.In>
  );
};

export default FooterCenter;
FooterCenter.displayName = "FooterCenter";
