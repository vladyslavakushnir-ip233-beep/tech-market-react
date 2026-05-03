const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

export async function fetchProducts(params = '') {
  const res = await fetch(`${API_BASE}/products${params}`);
  if (!res.ok) throw new Error('Fetch products failed');
  return res.json();
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Fetch product failed');
  return res.json();
}

export async function createProduct(productData, token) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Product creation failed');
  }
  return res.json();
}

export async function updateProduct(id, productData, token) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Product update failed');
  }
  return res.json();
}

export async function deleteProduct(id, token) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Product deletion failed');
  }
  return res.json();
}

export async function createOrder(order, token) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(order)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Order creation failed');
  }
  return res.json();
}

export async function getComments(productId, token) {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}/products/${productId}/comments`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(()=>({}));
    throw new Error(err.error || 'Fetch comments failed');
  }
  return res.json();
}

export async function postComment(productId, { rating = 0, comment = '' }, token) {
  const res = await fetch(`${API_BASE}/products/${productId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ rating, comment })
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({}));
    throw new Error(err.error || 'Post comment failed');
  }
  return res.json();
}

export async function moderateComment(commentId, action, token) {
  const res = await fetch(`${API_BASE}/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ action })
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({}));
    throw new Error(err.error || 'Moderation failed');
  }
  return res.json();
}

export async function setProductDiscount(productId, discount, token) {
  const res = await fetch(`${API_BASE}/products/${productId}/discount`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ discount })
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({}));
    throw new Error(err.error || 'Set discount failed');
  }
  return res.json();
}

export async function getSuppliers() {
  const res = await fetch(`${API_BASE}/suppliers`);
  if (!res.ok) throw new Error('Fetch suppliers failed');
  return res.json();
}

export async function createSupplier(supplierData, token) {
  const res = await fetch(`${API_BASE}/suppliers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(supplierData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Supplier creation failed');
  }
  return res.json();
}

export async function updateSupplier(id, supplierData, token) {
  const res = await fetch(`${API_BASE}/suppliers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(supplierData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Supplier update failed');
  }
  return res.json();
}

export async function deleteSupplier(id, token) {
  const res = await fetch(`${API_BASE}/suppliers/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Supplier deletion failed');
  }
  return res.json();
}

export async function getOrders(token) {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Fetch orders failed');
  return res.json();
}

export async function getOrderById(id, token) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Fetch order failed');
  return res.json();
}