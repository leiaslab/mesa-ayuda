import Image from "next/image";
import logoLLA from "../public/logo-lla-cropped.png";

type LogoLLAProps = {
  className?: string;
  priority?: boolean;
};

export default function LogoLLA({
  className,
  priority = false,
}: LogoLLAProps) {
  return (
    <Image
      src={logoLLA}
      alt="La Libertad Avanza"
      priority={priority}
      className={className}
      sizes="(min-width: 1024px) 208px, (min-width: 768px) 206px, 178px"
    />
  );
}
