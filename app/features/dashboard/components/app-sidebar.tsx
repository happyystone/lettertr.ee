import { RiSettingsLine, RiMailLine, RiSearchLine } from '@remixicon/react';
import { Link } from 'react-router';
import { useLocation } from 'react-router';
import type * as React from 'react';
import { Theme, useTheme } from 'remix-themes';

import { NavUser } from '@/features/dashboard/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/common/components/ui/sidebar';
import { site } from '@/config/site';

const data = {
  navMain: [
    {
      title: '메뉴',
      items: [
        { title: '뉴스레터 피드', url: '/letters', icon: RiMailLine },
        { title: '뉴스레터 찾기', url: '/discover', icon: RiSearchLine },
        { title: '설정', url: '/settings', icon: RiSettingsLine },
        // { title: 'Dashboard', url: '/dashboard', icon: RiSpeedUpLine },

        // { title: 'Analytics', url: '/analytics', icon: RiLineChartLine },
        // { title: 'Integrations', url: '/integrations', icon: RiToolsFill },

        // { title: 'Billing', url: '/billing', icon: RiBankCardLine },
        // { title: 'API', url: '/api', icon: RiCodeSSlashLine },
      ],
    },
  ],
};

function SidebarLogo() {
  const [theme] = useTheme();
  const logo = theme === Theme.DARK ? site.darkLogo : site.lightlogo;

  return (
    <div className="flex gap-2 px-2 transition-[padding] duration-300 ease-out group-data-[collapsible=icon]:px-0">
      <Link
        className="group/logo inline-flex items-center gap-2 transition-all duration-300 ease-out"
        to="/letters"
      >
        <span className="sr-only">{site.name}</span>
        <img
          src={logo}
          alt={site.name}
          width={24}
          height={24}
          className="transition-transform duration-300 ease-out group-data-[collapsible=icon]:scale-110"
        />
        <span className="group-data-[collapsible=icon]:-ml-2 truncate font-bold text-lg transition-[margin,opacity,transform,width] duration-300 ease-out group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:scale-95 group-data-[collapsible=icon]:opacity-0">
          {site.name}
        </span>
      </Link>
    </div>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="mb-4 h-13 justify-center max-md:mt-2">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="-mt-2">
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-muted-foreground/65 uppercase">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className="group/menu-button group-data-[collapsible=icon]:!px-[5px] h-9 gap-3 font-medium transition-all duration-300 ease-out [&>svg]:size-auto"
                        tooltip={item.title}
                        isActive={isActive}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          {item.icon && (
                            <item.icon
                              className="text-muted-foreground/65 group-data-[active=true]/menu-button:text-primary"
                              size={22}
                              aria-hidden="true"
                            />
                          )}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
