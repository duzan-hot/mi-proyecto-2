import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Protected } from "../components/Guards";
import { HomePage, LoginPage, RegisterPage, RoomDetailPage, RoomsPage, ServicesPage } from "../pages/PublicPages";
import { ConfirmationPage, MyReservationsPage, ProfilePage, ReservationPage } from "../pages/ClientPages";
import { AdminDashboard, AdminGarage, AdminReservations, AdminRooms, AdminServices, AdminUsers } from "../pages/AdminPages";
const Page=({children}:{children:React.ReactNode})=><Layout>{children}</Layout>;
function AppRoutes(){return <BrowserRouter><Routes>
  <Route path="/" element={<Page><HomePage/></Page>}/><Route path="/rooms" element={<Page><RoomsPage/></Page>}/><Route path="/rooms/:id" element={<Page><RoomDetailPage/></Page>}/><Route path="/services" element={<Page><ServicesPage/></Page>}/><Route path="/login" element={<Page><LoginPage/></Page>}/><Route path="/register" element={<Page><RegisterPage/></Page>}/>
  <Route path="/reservation" element={<Page><Protected><ReservationPage/></Protected></Page>}/><Route path="/reservation-confirmation" element={<Page><Protected><ConfirmationPage/></Protected></Page>}/><Route path="/my-reservations" element={<Page><Protected><MyReservationsPage/></Protected></Page>}/><Route path="/profile" element={<Page><Protected><ProfilePage/></Protected></Page>}/>
  <Route path="/admin" element={<Page><Protected admin><AdminDashboard/></Protected></Page>}/><Route path="/admin/users" element={<Page><Protected admin><AdminUsers/></Protected></Page>}/><Route path="/admin/rooms" element={<Page><Protected admin><AdminRooms/></Protected></Page>}/><Route path="/admin/reservations" element={<Page><Protected admin><AdminReservations/></Protected></Page>}/><Route path="/admin/services" element={<Page><Protected admin><AdminServices/></Protected></Page>}/><Route path="/admin/garage" element={<Page><Protected admin><AdminGarage/></Protected></Page>}/>
  <Route path="*" element={<Page><HomePage/></Page>}/>
</Routes></BrowserRouter>}; export default AppRoutes;
