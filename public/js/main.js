// Main JavaScript for Rebooku
const bootstrap = window.bootstrap // Declare the bootstrap variable

document.addEventListener("DOMContentLoaded", () => {
  // Update cart count on page load
  updateCartCount()

  // Initialize tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
})

// Cart functionality
function addToCart(bookId, quantity = 1) {
  fetch("/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookId, quantity }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showAlert("success", data.message)
        updateCartCount()
      } else {
        showAlert("danger", data.error)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showAlert("danger", "Terjadi kesalahan saat menambahkan ke keranjang")
    })
}

function updateCartQuantity(bookId, quantity) {
  fetch("/cart/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookId, quantity }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload()
      } else {
        showAlert("danger", data.error)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showAlert("danger", "Terjadi kesalahan saat mengupdate keranjang")
    })
}

function removeFromCart(bookId) {
  if (confirm("Apakah Anda yakin ingin menghapus item ini dari keranjang?")) {
    fetch("/cart/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          location.reload()
        } else {
          showAlert("danger", data.error)
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        showAlert("danger", "Terjadi kesalahan saat menghapus item")
      })
  }
}

function updateCartCount() {
  // This would typically fetch from server, but for simplicity using sessionStorage
  const cartCount = sessionStorage.getItem("cartCount") || "0"
  const cartBadge = document.getElementById("cart-count")
  if (cartBadge) {
    cartBadge.textContent = cartCount
  }
}

// Review functionality
function submitReview(bookId) {
  const rating = document.querySelector('input[name="rating"]:checked')
  const comment = document.getElementById("review-comment")

  if (!rating) {
    showAlert("warning", "Silakan pilih rating")
    return
  }

  fetch(`/books/${bookId}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rating: rating.value,
      comment: comment.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showAlert("success", data.message)
        setTimeout(() => location.reload(), 1500)
      } else {
        showAlert("danger", data.error)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showAlert("danger", "Terjadi kesalahan saat mengirim review")
    })
}

// Comment functionality
function submitComment(articleId) {
  const content = document.getElementById("comment-content")

  if (!content.value.trim()) {
    showAlert("warning", "Silakan tulis komentar")
    return
  }

  fetch(`/articles/${articleId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: content.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showAlert("success", data.message)
        content.value = ""
        setTimeout(() => location.reload(), 1500)
      } else {
        showAlert("danger", data.error)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showAlert("danger", "Terjadi kesalahan saat mengirim komentar")
    })
}

function likeComment(articleId, commentId) {
  fetch(`/articles/${articleId}/comment/${commentId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const likeBtn = document.querySelector(`[data-comment-id="${commentId}"] .like-btn`)
        const likeCount = document.querySelector(`[data-comment-id="${commentId}"] .like-count`)
        if (likeCount) {
          likeCount.textContent = data.likes
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

// Promo code validation
function validatePromoCode() {
  const promoInput = document.getElementById("promo-code")
  const subtotalElement = document.getElementById("subtotal")

  if (!promoInput.value.trim()) {
    showAlert("warning", "Silakan masukkan kode promo")
    return
  }

  const subtotal = Number.parseFloat(subtotalElement.textContent.replace(/[^\d.-]/g, ""))

  fetch("/transactions/validate-promo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: promoInput.value,
      subtotal: subtotal,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.valid) {
        showAlert("success", `Kode promo berhasil diterapkan! Diskon: Rp ${data.discount.toLocaleString("id-ID")}`)
        updateCheckoutTotal(subtotal, data.discount)
      } else {
        showAlert("danger", data.message)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showAlert("danger", "Terjadi kesalahan saat memvalidasi kode promo")
    })
}

function updateCheckoutTotal(subtotal, discount) {
  const discountElement = document.getElementById("discount")
  const totalElement = document.getElementById("total")

  if (discountElement) {
    discountElement.textContent = `Rp ${discount.toLocaleString("id-ID")}`
  }

  if (totalElement) {
    const total = subtotal - discount
    totalElement.textContent = `Rp ${total.toLocaleString("id-ID")}`
  }
}

// Image preview for file uploads
function previewImage(input, previewId) {
  const preview = document.getElementById(previewId)
  const file = input.files[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.src = e.target.result
      preview.style.display = "block"
    }
    reader.readAsDataURL(file)
  }
}

// Multiple image preview for book uploads
function previewMultipleImages(input) {
  const preview = document.getElementById("image-preview")
  preview.innerHTML = ""

  if (input.files) {
    Array.from(input.files).forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement("img")
        img.src = e.target.result
        img.className = "image-preview"
        img.alt = `Preview ${index + 1}`
        preview.appendChild(img)
      }
      reader.readAsDataURL(file)
    })
  }
}

// Search functionality
function performSearch() {
  const searchForm = document.getElementById("search-form")
  if (searchForm) {
    searchForm.submit()
  }
}

// Filter functionality
function applyFilters() {
  const filterForm = document.getElementById("filter-form")
  if (filterForm) {
    filterForm.submit()
  }
}

// Alert system
function showAlert(type, message) {
  const alertContainer = document.getElementById("alert-container") || createAlertContainer()

  const alert = document.createElement("div")
  alert.className = `alert alert-${type} alert-dismissible fade show alert-custom`
  alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  alertContainer.appendChild(alert)

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove()
    }
  }, 5000)
}

function createAlertContainer() {
  const container = document.createElement("div")
  container.id = "alert-container"
  container.style.position = "fixed"
  container.style.top = "20px"
  container.style.right = "20px"
  container.style.zIndex = "9999"
  container.style.maxWidth = "400px"
  document.body.appendChild(container)
  return container
}

// Form validation
function validateForm(formId) {
  const form = document.getElementById(formId)
  const inputs = form.querySelectorAll("input[required], select[required], textarea[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("is-invalid")
      isValid = false
    } else {
      input.classList.remove("is-invalid")
    }
  })

  return isValid
}

// Price formatting
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

// Date formatting
function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Date(dateString).toLocaleDateString("id-ID", options)
}

// Smooth scrolling
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

// Loading state management
function showLoading(buttonId) {
  const button = document.getElementById(buttonId)
  if (button) {
    button.disabled = true
    button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...'
  }
}

function hideLoading(buttonId, originalText) {
  const button = document.getElementById(buttonId)
  if (button) {
    button.disabled = false
    button.innerHTML = originalText
  }
}

// Confirmation dialogs
function confirmAction(message, callback) {
  if (confirm(message)) {
    callback()
  }
}

// Local storage helpers
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getFromLocalStorage(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

// Session storage helpers
function saveToSessionStorage(key, data) {
  sessionStorage.setItem(key, JSON.stringify(data))
}

function getFromSessionStorage(key) {
  const data = sessionStorage.getItem(key)
  return data ? JSON.parse(data) : null
}
