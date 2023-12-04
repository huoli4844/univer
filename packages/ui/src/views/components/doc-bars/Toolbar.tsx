import { useDependency } from '@wendellhu/redi/react-bindings';
import React, { useEffect, useState } from 'react';

import { useObservable } from '../../../components/hooks/observable';
import type { IDisplayMenuItem, IMenuItem } from '../../../services/menu/menu';
import { MenuGroup, MenuPosition } from '../../../services/menu/menu';
import { IMenuService } from '../../../services/menu/menu.service';
import type { IMenuGroup } from './hooks/menu';
import { position$, positions } from './hooks/menu';
import styles from './index.module.less';
import { ToolbarItem } from './ToolbarItem';

export function Toolbar() {
    const menuService = useDependency(IMenuService);

    const [group, setGroup] = useState<IMenuGroup[]>([]);

    const position = useObservable(position$, MenuPosition.TOOLBAR_START, true);

    useEffect(() => {
        const listener = menuService.menuChanged$.subscribe(() => {
            const group: IMenuGroup[] = [];
            for (const position of positions) {
                const menuItems = menuService.getMenuItems(position);

                if (menuItems.length) {
                    group.push({
                        name: position,
                        menuItems,
                    });
                }
            }

            setGroup(group);
        });

        return () => {
            listener.unsubscribe();
        };
    }, []);

    const activeMenuGroup = group.find((g) => g.name === position);

    const toolbarGroups =
        activeMenuGroup?.menuItems.reduce(
            (acc, item) => {
                const key = item.group ?? MenuGroup.TOOLBAR_OTHERS;
                if (!acc[key]) {
                    acc[key] = [];
                }

                acc[key].push(item);
                return acc;
            },
            {} as Record<MenuGroup, Array<IDisplayMenuItem<IMenuItem>>>
        ) ?? ({} as Record<MenuGroup, Array<IDisplayMenuItem<IMenuItem>>>);

    return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarContainer}>
                {Object.entries(toolbarGroups).map(([key, item]) => (
                    <div key={key} className={styles.toolbarGroup}>
                        {item.map((subItem) => (
                            <ToolbarItem key={subItem.id} {...subItem} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}