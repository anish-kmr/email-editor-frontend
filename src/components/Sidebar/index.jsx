import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'; 

import Hamburger from 'hamburger-react'

import AddBoxIcon from '@material-ui/icons/AddBox';
import LineStyleIcon from '@material-ui/icons/LineStyle';
import NoteIcon from '@material-ui/icons/Note';

import './sidebar.css'

const Sidebar = ({navOpen,setNavOpen}) => {
    
    return (
        <div className={!navOpen && "shrink_sidebar"} id="sidebar" >
            <div className="ham">
                <Hamburger toggled={navOpen} className="ham_icon" toggle={setNavOpen} color="white" />
            </div>
            {/* <div className="logo">Email Editor</div> */}
            <div className="nav">
                <NavLink exact to='/email-editor' activeClassName="nav_item_selected" className="nav_item" >
                    <AddBoxIcon className="nav_icon"/>
                    {
                        navOpen &&
                        <div className="nav_text"> New Template </div>
                    }
                </NavLink>
                <NavLink exact to='/drafts' activeClassName="nav_item_selected" className="nav_item" >
                    <NoteIcon className="nav_icon"/>
                    {
                        navOpen &&
                        <div className="nav_text">Drafts</div>
                    }
                </NavLink>
                <NavLink exact to='/templates' activeClassName="nav_item_selected" className="nav_item" >
                    <LineStyleIcon className="nav_icon"/>
                    {
                        navOpen &&
                        <div className="nav_text"> Saved Templates</div>
                    }
                </NavLink>
            </div>
        </div>
    )
}
 
export default Sidebar