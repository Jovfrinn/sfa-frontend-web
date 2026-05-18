import { Icon } from "@iconify/react/dist/iconify.js";
import Breadcrumb from "../../components/Breadcrumb";
import DashBoardLayerTwo from "../../components/DashBoardLayerTwo";
import MasterLayout from "../../masterLayout/MasterLayout";
import UnitCountTwo from "../../components/child/UnitCountTwo";

export const metadata = {
  title: "WowDash NEXT JS - Admin Dashboard Multipurpose Bootstrap 5 Template",
  description:
    "Wowdash NEXT JS is a developer-friendly, ready-to-use admin template designed for building attractive, scalable, and high-performing web applications.",
};
const TestPage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title="CRM" />

        <section className="row gy-4">
          <div className="col-xxl-8">
            <div className="row gy-4">
              <div className='col-xxl-4 col-sm-6'>
          <div className='card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-1'>
            <div className='card-body p-0'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                <div className='d-flex align-items-center gap-2'>
                  <span className='mb-0 w-48-px h-48-px bg-primary-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0'>
                    <Icon icon='mingcute:user-follow-fill' className='icon' />
                  </span>
                  <div>
                    <span className='mb-2 fw-medium text-secondary-light text-sm'>
                      New Users
                    </span>
                    <h6 className='fw-semibold'>15,000</h6>
                  </div>
                </div>
                <div
                  id='new-user-chart'
                  className='remove-tooltip-title rounded-tooltip-value'
                >
                  {/* Pass the color value here */}
                </div>
              </div>
              <p className='text-sm mb-0'>
                Increase by{" "}
                <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                  +200
                </span>{" "}
                this week
              </p>
            </div>
          </div>
        </div>
            </div>
          </div>
        </section>
      </MasterLayout>
    </>
  );
};

export default TestPage;
