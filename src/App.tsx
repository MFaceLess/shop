import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ConcreteProductCardComponent, ProductsPageComponent } from './pages';
import { PurchaseComponent } from './pages/purchase-page/purchase-page.component';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Navigate to={'/products'} replace />} />
        <Route path='/products' element={<ProductsPageComponent />}/>
        <Route path='/products/:id' element={<ConcreteProductCardComponent />} />
        <Route path='/purchase' element={<PurchaseComponent />} />
      </Routes>
    </HashRouter>
  )
}

export default App;
