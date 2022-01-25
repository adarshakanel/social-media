import React from 'react';
import "./Topbar.css"
import { Search, Person, Chat, Notifications } from "@material-ui/icons"
export default function Topbar() {
    return (
        <div className='topbarContainer'>
            <div className="topbarLeft">
                <span className="logo">Lamasocial</span>
            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                    <Search> </Search>
                    <input placeholder='Seach for friends, post or video' className="searchInput" />
                </div>
            </div>
            <div className="topbarRight">
                <div className="topbarLinks">
                    <span className="topbarLink">
                        Homepage
                    </span>
                    <span className="topbarLink">
                        Timeline
                    </span>
                </div>
                <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <Person></Person>
                        <span className="topbarIconBadge">
                            1
                        </span>
                    </div>
                    <div className="topbarIconItem">
                        <Chat></Chat>
                        <span className="topbarIconBadge">
                            2
                        </span>
                    </div>
                    <div className="topbarIconItem">
                        <Notifications></Notifications>
                        <span className="topbarIconBadge">
                            1
                        </span>
                    </div>
                    <img src="/assets/person/1.jpeg" alt="" className="topbarImg" />
                </div>
            </div>
        </div>
    );
}
