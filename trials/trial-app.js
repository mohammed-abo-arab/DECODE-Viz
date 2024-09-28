<Drawer
  variant="persistent"
  open={visibleMainMenu}
  style={{ position: "relative", zIndex: 1 }}
  onClose={this.toggleMainMenu}
>
  <div className={classes.toolbar}>
    <PerfectScrollbar>
      <List dense={true} style={{ display: "flex", flexDirection: "column" }}>
        <ListItem
          button
          onClick={() => this.showAppBar()}
          style={{ flexDirection: "row" }}
        >
          <ListItemIcon>
            <MenuIcon />
          </ListItemIcon>
          <ListItemText primary="Tool Bar" />
        </ListItem>
        <ListItem
          button
          onClick={() => this.toggleFileManager()}
          style={{ flexDirection: "row" }}
        >
          <ListItemIcon>
            <Icon path={mdiFileCabinet} size={iconSize} color={iconColor} />
          </ListItemIcon>
          <ListItemText classes={primaryClass} primary="File Manager" />
        </ListItem>
        <ListItem
          button
          onClick={() => this.toggleOpenMenu()}
          style={{ flexDirection: "row" }}
        >
          <ListItemIcon>
            <Icon path={mdiFolderMultiple} size={iconSize} color={iconColor} />
          </ListItemIcon>
          <ListItemText classes={primaryClass} primary="Open ..." />
          {openMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openMenu} timeout="auto" unmountOnExit>
          <List
            dense={true}
            component="div"
            style={{ flexDirection: "column" }}
          >
            <ListItem
              button
              style={{ paddingLeft: 30, flexDirection: "row" }}
              onClick={() => this.showFileOpen()}
            >
              {/* File */}
              {/* ... */}
            </ListItem>
            {/* ... (other menu items) */}
          </List>
        </Collapse>
        <ListItem
          button
          onClick={() => this.clear()}
          style={{ flexDirection: "row" }}
        >
          <ListItemIcon>
            <Icon path={mdiDelete} size={iconSize} color={iconColor} />
          </ListItemIcon>
          <ListItemText classes={primaryClass} primary="Clear All" />
        </ListItem>
        {/* ... (other horizontal items) */}
      </List>
      {/* ... (additional controls) */}
    </PerfectScrollbar>
  </div>
</Drawer>;
