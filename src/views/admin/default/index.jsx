/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
    Avatar,
    Box,
    Flex,
    FormLabel,
    Icon,
    Select,
    SimpleGrid,
    useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, {useEffect, useState} from "react";
import {
    MdAddTask,
    MdAttachMoney,
    MdBarChart,
    MdFileCopy,
} from "react-icons/md";
import { IoFootsteps } from "react-icons/io5";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import {
    columnsDataCheck,
    columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
import redirect from "react-router-dom/es/Redirect";

export default function UserReports() {
    const [stats, setStats] = useState({});

    useEffect(async () => {
        const response = await fetch("http://localhost:80" + "/api/stats", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        });
        const data = await response.json();
        if (response.status === 200) {
            setStats(data);
        } else {
            localStorage.removeItem("token");
            redirect("/");
        }
    }, []);

    // Chakra Color Mode
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    return (

        <Box pt={{base: "130px", md: "80px", xl: "80px"}}>
            <SimpleGrid
                columns={{base: 1, md: 2, lg: 3, "2xl": 6}}
                gap='20px'
                mb='60px'>
                <MiniStatistics
                    startContent={
                        <IconBox
                            w='56px'
                            h='56px'
                            bg={boxBg}
                            icon={
                                <Icon w='32px' h='32px' as={IoFootsteps} color={brandColor}/>
                            }
                        />
                    }
                    name='Pas Totaux'
                    value={stats.totalSteps}
                />
                <MiniStatistics
                    startContent={
                        <IconBox
                            w='56px'
                            h='56px'
                            bg={boxBg}
                            icon={
                                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor}/>
                            }
                        />
                    }
                    name='Pas ce mois'
                    value={stats.totalMonthSteps}
                />
            </SimpleGrid>

            <SimpleGrid columns={{base: 1, md: 2, xl: 2}} gap='20px' mb='20px'>
                {
                    stats.monthSteps && <TotalSpent steps={stats.monthSteps}/>
                }
                {
                    stats.weekSteps && <WeeklyRevenue steps={stats.weekSteps}/>
                }
            </SimpleGrid>
        </Box>
    );
}
