import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const MasterLayout = ({ children }) => {
  const RoleLog = useSelector((state) => state.auth.user.role);
  const ProfilePhoto = useSelector((state) => state.auth.user.profil_photo);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Apakah anda yakin ingin keluar ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());

        localStorage.clear();

        navigate("/login", { replace: true });

        Swal.fire({
          title: "Berhasil!",
          text: "Anda telah logout.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const user = localStorage.getItem("user");
  let userData;
  if (user) {
    userData = JSON.parse(user);
  }
  // const role = userData?.role;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px"; // Collapse submenu
        }
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
        }
      }
    };

    // Attach click event listeners to all dropdown triggers
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location ||
            link.getAttribute("to") === location
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
            }
          }
        });
      });
    };

    // Open the submenu that contains the active route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      {/* {console.log("Show log : ", userLog)} */}
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
              ? "sidebar sidebar-open"
              : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type="button"
          className="sidebar-close-btn"
        >
          <Icon icon="radix-icons:cross-2" />
        </button>
        <div>
          <Link to="/dashboard" className="sidebar-logo">
            <img
              src="/assets/images/logo.png"
              alt="site logo"
              className="light-logo"
            />
            <img
              src="/assets/images/logo.png"
              alt="site logo"
              className="ms-2 dark-logo"
            />
            <img
              src="/assets/images/logo-icon.png"
              alt="site logo"
              className="ms-4 logo-icon"
            />
          </Link>
        </div>
        <div className="sidebar-menu-area">
          <ul className="sidebar-menu" id="sidebar-menu">
            <li className="">
              <Link to="/dashboard">
                <Icon
                  icon="solar:home-smile-angle-outline"
                  className="menu-icon"
                />
                <span>Dashboard</span>
              </Link>
            </li>

            <li className="sidebar-menu-group-title ms-2">Master</li>
            <li>
              <Link
                to="/master/company"
                className={pathname.includes("company") ? "active-page" : ""}
              >
                <Icon icon="mdi:company" className="menu-icon" />
                <span>Company</span>
              </Link>
            </li>

            <li className="dropdown mt-4">
              <Link
                to="#"
                className={pathname.includes("customer") ? "active-page" : ""}
              >
                <Icon icon="mdi:people-group" className="menu-icon" />
                <span>Customer</span>
              </Link>

              <ul
                className={`sidebar-submenu ${pathname.includes("customer") ? "open" : ""
                  }`}
              >
                {RoleLog === "superadmin" && (
                  <>
                    <li>
                      <Link
                        to="/master/customer/unregis"
                        className={
                          pathname.includes("unregis") ? "active-page" : ""
                        }
                      >
                        Unregis
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/master/customer/on-check-spv"
                        className={
                          pathname.includes("on-check-spv") ? "active-page" : ""
                        }
                      >
                        On Check ( SPV )
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/master/customer/on-check-manager"
                        className={
                          pathname.includes("on-check-manager")
                            ? "active-page"
                            : ""
                        }
                      >
                        On Check ( Manager )
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/master/customer/registered"
                        className={
                          pathname.includes("registered") ? "active-page" : ""
                        }
                      >
                        Registered
                      </Link>
                    </li>
                  </>
                )}
                {RoleLog === "manager" && (
                  <>
                    <li>
                      <Link
                        to="/master/customer/unregis"
                        className={
                          pathname.includes("unregis") ? "active-page" : ""
                        }
                      >
                        Unregis
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/master/customer/on-check-manager"
                        className={
                          pathname.includes("on-check-manager")
                            ? "active-page"
                            : ""
                        }
                      >
                        On Check
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/master/customer/registered"
                        className={
                          pathname.includes("registered") ? "active-page" : ""
                        }
                      >
                        Registered
                      </Link>
                    </li>
                  </>
                )}
                
                {RoleLog === "admin" && (
                  <>
                    <li>
                      <Link
                        to="/master/customer/unregis"
                        className={
                          pathname.includes("unregis") ? "active-page" : ""
                        }
                      >
                        Unregis
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/master/customer/registered"
                        className={
                          pathname.includes("registered") ? "active-page" : ""
                        }
                      >
                        Registered
                      </Link>
                    </li>
                  </>
                )}

                {RoleLog === "supervisor" || RoleLog === "manager-spv"? (
                  <>
                    <li>
                      <Link
                        to="/master/customer/on-check-spv"
                        className={
                          pathname.includes("on-check-spv") ? "active-page" : ""
                        }
                      >
                        On Check
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/master/customer/registered"
                        className={
                          pathname.includes("registered") ? "active-page" : ""
                        }
                      >
                        Registered
                      </Link>
                    </li>
                  </>
                ) : (<></>)}
                {!["superadmin", "manager", "supervisor", "manager-spv","admin"].includes(RoleLog) && (
                  <>
                    <li>
                      <Link
                        to="/master/customer/unregis"
                        className={
                          pathname.includes("unregis") ? "active-page" : ""
                        }
                      >
                        Unregistered
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/master/customer/registered"
                        className={
                          pathname.includes("registered") ? "active-page" : ""
                        }
                      >
                        Registered
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </li>

            <li className="dropdown">
              <Link
                to="/master/inventory"
                className={pathname.includes("inventory") ? "active-page" : ""}
              >
                <Icon icon="mdi:box-variant-closed" className="menu-icon" />
                <span>Inventory</span>
              </Link>

              <ul
                className={`sidebar-submenu ${pathname.includes("inventory") ? "open" : ""
                  }`}
              >
                <li>
                  <Link
                    to="/master/inventory/brand"
                    className={pathname.includes("brand") ? "active-page" : ""}
                  >
                    Brand
                  </Link>
                </li>
                <li>
                  <Link
                    to="/master/inventory/category"
                    className={
                      pathname.includes("category") ? "active-page" : ""
                    }
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/master/inventory/list"
                    className={pathname.includes("list") ? "active-page" : ""}
                  >
                    Inventory
                  </Link>
                </li>
                <li>
                  <Link
                    to="/master/inventory/stock"
                    className={pathname.includes("stock") ? "active-page" : ""}
                  >
                    Stock
                  </Link>
                </li>
              </ul>
            </li>

            <li className="sidebar-menu-group-title ms-2">Menu</li>

            <li>
              <Link
                to="/menu/report/visit"
                className={pathname.includes("report") ? "active-page" : ""}
              >
                <Icon icon="hugeicons:invoice-03" className="menu-icon" />
                <span>Report Visit</span>
              </Link>
            </li>
            {/* PO */}
            <li>
              <Link
                to="/menu/pre-order"
                className={pathname.includes("pre-order") ? "active-page" : ""}
              >
                <Icon
                  icon="lsicon:work-order-appointment-filled"
                  className="menu-icon"
                />
                <span>PO</span>
              </Link>
            </li>

            {/* Competitor Brand */}
            <li>
              <Link
                to="/menu/competitor-brand"
                className={
                  pathname.includes("competitor-brand") ? "active-page" : ""
                }
              >
                <Icon icon="tabler:briefcase" className="menu-icon" />
                <span>Competitor Brand</span>
              </Link>
            </li>



            {/* Market Size */}
            <li className="dropdown mt-4">
              <Link
                to="/selling-out"
                className={
                  pathname.includes("selling-out") ? "active-page" : ""
                }
              >
                <Icon icon="fluent-mdl2:market" className="menu-icon" />
                <span>Selling Out</span>
              </Link>

              <ul
                className={`sidebar-submenu ${pathname.includes("selling-out") ? "open" : ""
                  }`}
              >
                <li>
                  <Link
                    to="/selling-out/list"
                    className={
                      pathname.includes("list") ? "active-page my-1" : "my-1"
                    }
                  >
                    Selling Out
                  </Link>
                </li>
                <li>
                  <Link
                    to="/selling-out/global"
                    className={
                      pathname.includes("global") ? "active-page my-1" : "my-1"
                    }
                  >
                    Selling Out Global
                  </Link>
                </li>
              </ul>
            </li>

            {/* Journey Plan */}
            <li>
              <Link
                to="/menu/journey-plan"
                className={
                  pathname.includes("journey-plan") ? "active-page" : ""
                }
              >
                <Icon icon="tabler:map-2" className="menu-icon" />
                <span>Journey Plan</span>
              </Link>
            </li>

            {/* <li className="mt-1">
              <Link
                to="/menu/summary/visit"
                className={pathname.includes("summary") ? "active-page" : ""}
              >
                <Icon icon="hugeicons:invoice-03" className="menu-icon" />
                <span>Summary Visit</span>
              </Link>
            </li> */}

            <li className="sidebar-menu-group-title ms-2">CRM</li>

            {/* Interaction Log */}
            <li>
              <Link
                to="/crm/interaction-logs"
                className={
                  pathname.includes("interaction-logs") ? "active-page" : ""
                }
              >
                <Icon icon="tabler:message-report" className="menu-icon" />
                <span>Interaction Log</span>
              </Link>
            </li>

            {/* Follow-up Reminder */}
            <li>
              <Link
                to="/crm/follow-up"
                className={
                  pathname.includes("follow-up") ? "active-page" : ""
                }
              >
                <Icon icon="lucide:bell-ring" className="menu-icon" />
                <span>Follow-up</span>
              </Link>
            </li>
            <li className="sidebar-menu-group-title ms-2">Setting</li>
            {/* Role */}
            <li>
              <Link
                to="/setting/role"
                className={
                  pathname.includes("role") ? "active-page" : ""
                }
              >
                <Icon icon="tabler:user-cog" className="menu-icon" />
                <span>Role</span>
              </Link>
            </li>
            {/* User */}
            <li>
              <Link
                to="/setting/user"
                className={
                  pathname.includes("user") ? "active-page" : ""
                }
              >
                <Icon icon="lucide:user" className="menu-icon" />
                <span>User</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className="navbar-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon="iconoir:arrow-right"
                      className="icon text-2xl non-active"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:bars-3-solid"
                      className="icon text-2xl non-active "
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type="button"
                  className="sidebar-mobile-toggle"
                >
                  <Icon icon="heroicons:bars-3-solid" className="icon" />
                </button>
                <form className="navbar-search">
                  <input type="text" name="search" placeholder="Search" />
                  <Icon icon="ion:search-outline" className="icon" />
                </form>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
                {/* ThemeToggleButton */}
                <ThemeToggleButton />

                <div className="dropdown">
                  <button
                    className="has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                    onClick={() => {
                      setShowNotification(true);
                    }}
                  >
                    <Icon
                      icon="iconoir:bell"
                      className="text-primary-light text-xl"
                    />
                  </button>
                  <div
                    className={`dropdown-menu to-top dropdown-menu-lg p-0 ${showNotification == true ? "show" : ""
                      }`}
                  >
                    <div className="m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-0">
                          Notifications
                        </h6>
                      </div>
                      <span
                        className="text-danger-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center"
                        role="button"
                        onClick={() => {
                          setShowNotification(false);
                        }}
                      >
                        X
                      </span>
                    </div>
                    <div className="max-h-400-px overflow-y-auto scroll-sm pe-4">
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            <Icon
                              icon="bitcoin-icons:verify-outline"
                              className="icon text-xxl"
                            />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Congratulations
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              Your profile has been Verified. Your profile has
                              been Verified
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            <img
                              src="/assets/images/notification/profile-1.png"
                              alt=""
                            />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Ronald Richards
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              You can stitch between artboards
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-info-subtle text-info-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            AM
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Arlene McCoy
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            <img
                              src="/assets/images/notification/profile-2.png"
                              alt=""
                            />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Annette Black
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-info-subtle text-info-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            DR
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Darlene Robertson
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                    </div>
                    {/* <div className="text-center py-12 px-16">
                      <Link
                        to="#"
                        className="text-primary-600 fw-semibold text-md"
                      >
                        See All Notification
                      </Link>
                    </div> */}
                  </div>
                </div>
                {/* Notification dropdown end */}

                <div className="dropdown">
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <div className="d-flex flex-column align-items-start mt-1">
                      <div className="text-username">{userData?.full_name}</div>
                      <div className="text-position">{userData?.position}</div>
                    </div>
                    <button
                      className={`d-flex justify-content-center align-items-center rounded-circle`}
                      type="button"
                      data-bs-toggle="dropdown"
                      onClick={() => setShowProfile(!showProfile)}
                    >
                      <img
                        src={
                          ProfilePhoto
                            ? ProfilePhoto
                            : "/assets/images/user-empty.png"
                        }
                        alt="image_user"
                        className="w-40-px h-40-px object-fit-cover rounded-circle"
                      />
                    </button>
                  </div>
                  <div
                    className={`dropdown-menu to-top   dropdown-menu-sm ${showProfile ? "show" : ""
                      }`}
                  >
                    <div className="py-12 px-16 radius-8 showbg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-2">
                          {userData?.full_name}
                        </h6>
                        <span className="text-secondary-light fw-medium text-sm">
                          {userData?.position}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowProfile(false)}
                        type="button"
                        className="hover-text-danger"
                      >
                        <Icon
                          icon="radix-icons:cross-1"
                          className="icon text-xl"
                        />
                      </button>
                    </div>
                    <ul className="to-top-list">
                      <li>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                          to="/view-profile"
                        >
                          <Icon
                            icon="solar:user-linear"
                            className="icon text-xl"
                          />{" "}
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => handleLogout()}
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3"
                          to="#"
                        >
                          <Icon icon="lucide:power" className="icon text-xl" />
                          Log Out
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Profile dropdown end */}
              </div>
            </div>
          </div>
        </div>

        {/* dashboard-main-body */}
        <div className="dashboard-main-body">{children}</div>

        {/* Footer section */}
        <footer className="d-footer">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <p className="mb-0">© 2025 WowDash. All Rights Reserved.</p>
            </div>
            <div className="col-auto">
              <p className="mb-0">
                Made by <span className="text-primary-600">wowtheme7</span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
};

export default MasterLayout;
