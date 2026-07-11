import {
  fetchApi
} from "./fetchApi.js";

function setupTimelineScroll() {
  const icons = document.querySelectorAll('.timeline-icon');
  const sections = ['.section-3', '.section-4', '.section-5', '.section-6'];
  const headerHeight = 205; 
  icons.forEach((icon, index) => {
    icon.addEventListener('click', function() {
      if (this.classList.contains('active')) {
        const section = document.querySelector(sections[index]);
        if (section) {
          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: sectionTop - headerHeight, // Trừ đi chiều cao header
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

function updateTimeLine(step) {
  const timeline_bar = document.querySelector(".timeline-bar");
  timeline_bar.classList.remove('step-0','step-1', 'step-2', 'step-3', 'step-4');
  timeline_bar.classList.add(`step-${step}`);


  const icons = document.querySelectorAll(".timeline-icon");
  icons.forEach((icon, index) => {
    const isActive = (step === 3) ? true : (index < step);
    if (isActive) {
      icon.classList.add('active');
    } else {
      icon.classList.remove('active');
    }
  });

  const item_actives = document.querySelectorAll(".item-active");
  item_actives.forEach((icon, index) => {
    const isActive = (step === 3) ? true : (index < step);
    if (isActive) {
      icon.classList.add('active');
    } else {
      icon.classList.remove('active');
    }
  });
}


function runParallax() {
  document.querySelectorAll(".imgs img").forEach((img, index) => {
    let startY = img.getBoundingClientRect().top + window.scrollY;
    const speed = 0.1;

    window.addEventListener("scroll", function () {
      const scrolled = window.scrollY;
      img.style.transform = `translateY(${(scrolled - startY) * speed}px)`;
    });
  });
}

function getRemainingProducts() {
  return document.querySelectorAll(".column-products .grid-products");
}

function updateTotalPrice(gridProduct, quantity) {
  const priceElement = gridProduct.querySelector('.col-price');
  const totalElement = gridProduct.querySelector('.col-total');
  const priceNumber = parseInt(priceElement.textContent.replace(/,/g, ''));
  const total = priceNumber * quantity;
  totalElement.textContent = total.toLocaleString('en-US') + ' VNĐ';
}

function calculate() {
  let total = 0;
  const grid_products = document.querySelectorAll(".section-3 .user-card-body .column-products .grid-products");
  grid_products.forEach(item => {
    const checkBox = item.querySelector(".col-action input");
    const totalElement = item.querySelector(".col-total");
    if (checkBox.checked) {
      const priceNumber = parseInt(totalElement.textContent.replace(/,/g, ''));
      total += priceNumber;
    }
  });
  const format_total = total.toLocaleString('en-US') + " VND";
  const column_total_price = document.querySelector(".section-3 .user-card-body .column-total-price div span");
  const amount_currency = document.querySelector(".section-5 .payment .payment-body .payment-amount .amount-value");
  amount_currency.innerHTML = format_total;
  column_total_price.innerHTML = format_total;
}

//section-3
function quantityButtons() {
  const btn_minus = document.querySelectorAll(".btn-minus");
  btn_minus.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const gridProduct = this.closest('.grid-products');
      const quantity = gridProduct.querySelector(".quantity");
      let currentQuantity = parseInt(quantity.textContent);
      if (currentQuantity > 1) {
        currentQuantity--;
        quantity.textContent = currentQuantity;
        updateTotalPrice(gridProduct, currentQuantity);
        calculate();
      } else if (currentQuantity == 1) {
        const grid_ProductId = gridProduct.id;
        if (confirm("Xoá sản phẩm này ra khỏi giỏ hàng")) {
          localStorage.removeItem(grid_ProductId);
          gridProduct.remove();
        }
      }
    })
  })
  document.querySelectorAll(".btn-plus").forEach(function (btn) {
    btn.addEventListener('click', function () {
      const gridProduct = this.closest('.grid-products');
      const quantity = gridProduct.querySelector(".quantity");
      let currentQuantity = parseInt(quantity.textContent);
      currentQuantity++;
      quantity.textContent = currentQuantity;
      updateTotalPrice(gridProduct, currentQuantity);
      calculate();
    });
  });
}


function checkBoxEvent() {
  const allCheckBox = document.querySelector(".column-feature #selectAll");
  allCheckBox.addEventListener('change', (e) => {
    const isCheck = e.target.checked;
    const checkBoxs = document.querySelectorAll(".column-products .col-action input");
    checkBoxs.forEach(item => {
      item.checked = isCheck;
    });
    calculate();
  })

  const checkBoxs = document.querySelectorAll(".user-card-body .column-products .grid-products .col-action input");
  checkBoxs.forEach(item => {
    item.addEventListener('change', function (e) {
      let isAllCheckBox = true;
      const allCheckboxes = document.querySelectorAll(".column-products .col-action input");
      allCheckboxes.forEach(cb => {
        if (!cb.checked) {
          isAllCheckBox = false;
        }
      });
      allCheckBox.checked = isAllCheckBox;
      calculate();
    });
  });
}

function deleteEvent() {
  const deleteAllButton = document.querySelector(".column-feature .col-del i");
  const deleteButtons = document.querySelectorAll(".column-products .col-del i");
  deleteAllButton.addEventListener('click', function () {
    if (confirm("xoá tất cả sản phẩm trong giỏ hàng")) {
      deleteButtons.forEach(btn => {
        const grid_product = btn.closest(".grid-products");
        grid_product.remove();
        const productId = grid_product.id;
        localStorage.removeItem(productId);
      });
    }
  })

  let remainingProducts = getRemainingProducts();
  deleteButtons.forEach(item => {
    item.addEventListener('click', function () {
      const grid_product = this.closest(".grid-products");
      grid_product.remove();
      const productId = grid_product.id;
      localStorage.removeItem(productId);
      let col_product_feature = document.querySelector(".column-feature .col-product");
      col_product_feature.innerHTML = `Tất cả (${remainingProducts.length} sản phẩm)`;
      calculate();
    });
  });
  if (remainingProducts.length === 0) {
    const card_non_empty = document.querySelector(".section-3 .user-card-body .card-non-empty");
    const card_empty = document.querySelector(".section-3 .user-card-body .card-empty");
    if (card_non_empty) {
      card_non_empty.classList.remove("show");
      card_non_empty.classList.add("hidden");
    }
    if (card_empty) {
      card_empty.classList.remove("hidden");
      card_empty.classList.add("show");
    }
  }
}

function saveSelectedProducts() {
  const selectedProducts = [];
  const checkBoxes = document.querySelectorAll(".column-products .grid-products .col-action input:checked");

  checkBoxes.forEach(item => {
    const gridProduct = item.closest(".grid-products");
    if (gridProduct) {
      const product = {
        id: gridProduct.id,
        name: gridProduct.querySelector('.col-product span').textContent,
        price: gridProduct.querySelector('.col-price').textContent,
        quantity: gridProduct.querySelector('.quantity').textContent,
        total: gridProduct.querySelector('.col-total').textContent,
        thumbnail: gridProduct.querySelector('.col-product img').src
      }
      selectedProducts.push(product);
      console.log(selectedProducts);
    }
  });
  return selectedProducts;
}

function btn_products() {
  const btn_submit = document.querySelector(".btn__user-card");
  btn_submit.addEventListener('click', () => {
    const checkBoxs = document.querySelectorAll(".user-card-body .column-products .grid-products .col-action input");
    let hasBoxChecked = false;
    checkBoxs.forEach(item => {
      if (item.checked) {
        hasBoxChecked = true;
      }
    });
    if (hasBoxChecked) {

      saveSelectedProducts();
      updateTimeLine(1);
      const section_4 = document.querySelector(".section-4");
      if (section_4.classList.contains("hidden")) {
        section_4.classList.remove("hidden");
        section_4.classList.add("show");
      }
      runParallax();
    } else {
      alert("Vui lòng chọn 1 sản phẩm trước khi xác nhận");
    }
  });
}

// end section-3

// section-4
function saveUserInfo() {
  let displayDate = '';
  const dateOfBirth = localStorage.getItem('dateOfBirth');
  if (dateOfBirth) {
    const date = new Date(dateOfBirth);
    date.getDate();
    displayDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }
  document.getElementById('displayName').textContent = localStorage.getItem("fullName");
  document.getElementById('displayEmail').textContent = localStorage.getItem("Email") || 'Không có';
  document.getElementById('displayPhone').textContent = localStorage.getItem("phoneNumber");
  document.getElementById('displayBirthday').textContent = displayDate;
  document.getElementById('displayGender').textContent = localStorage.getItem("sex");
  document.getElementById('empty-state').style.display = 'none';
  document.getElementById('infor-display').classList.add('show');
}
// end section-4

// section-5

function selectBank() {
  document.querySelectorAll(".card-item").forEach(card => {
    card.addEventListener('click', function () {
      document.querySelectorAll('.bank-value').forEach(el => {
        el.classList.remove("active");
        el.classList.add("hidden");
      });
      const credit_infor = document.querySelector(".credit-infor");
      if(credit_infor.classList.contains("hidden")) {
        credit_infor.classList.remove("hidden");
        credit_infor.classList.add("show");
      }
      const card_default = document.querySelector(".card-default");
      if(card_default.classList.contains("show")) {
        card_default.classList.remove("show");
        card_default.classList.add("hidden");
      } 

      const bankId = this.id;
      const card_right = document.querySelector(`#bankData-${bankId}`);
      console.log(card_right);
      if (card_right) {
        card_right.classList.remove("hidden");
        card_right.classList.add("active");      
      } 

      const bankName = this.getAttribute('name');
      const btn_credit = document.querySelector(".section-5 .payment-body .button-1");
      btn_credit.onclick = () => {
        if (confirm("Chấp nhận chuyển khoản")) {
          localStorage.setItem('bankName', bankName);
          const time_now = new Date();
          const order_Date = time_now.toUTCString();
          localStorage.setItem("order_Date", order_Date);
          displayOrderInfo();
          const section_6 = document.querySelector(".section-6");
          if (section_6.classList.contains("hidden")) {
            section_6.classList.remove("hidden");
            section_6.classList.add("show");
          }
          updateTimeLine(3);
        }
      }
    });
  });
}
// end section_5

// section 6
function displayOrderInfo() {
  const fullName = localStorage.getItem('fullName');
  const email = localStorage.getItem('Email');
  const phoneNumber = localStorage.getItem('phoneNumber');
  const dateOfBirth = localStorage.getItem('dateOfBirth');
  const gender = localStorage.getItem('sex');
  const order_Date = localStorage.getItem('order_Date');

  document.querySelector(".section-6 .buyer-card__body .buyer-name span").innerHTML = fullName;
  document.querySelector(".section-6 .buyer-card__body .buyer-email span").innerHTML = email;
  document.querySelector(".section-6 .buyer-card__body .buyer-phoneNumber span").innerHTML = phoneNumber;
  document.querySelector(".section-6 .buyer-card__body .buyer-dateOfBirth span").innerHTML = dateOfBirth;
  document.querySelector(".section-6 .buyer-card__body .buyer-gender span").innerHTML = gender;
  document.querySelector(".section-6 .buyer-card__body .buyer-orderDate span").innerHTML = order_Date;

  const courseList = document.querySelector(".course-list__body");
  const selectedProducts = saveSelectedProducts();
  console.log(selectedProducts);
  const totalCouseList = document.querySelector(".course-list__count");
  totalCouseList.innerHTML = `${selectedProducts.length} khoá học`;
  let htmls = '';
  selectedProducts.forEach(item => {
    htmls += `
    <div class="course-item">
      <img src="${item.thumbnail}" alt="Course"
          class="course-item__thumb">
      <div class="course-item__name">${item.name}</div>
      <div class="course-item__price">
          <span class="course-item__price-value">${item.price}</span>
          <span class="course-item__price-x">x${item.quantity}</span>
      </div>
    </div>
    `
  });
  courseList.innerHTML = htmls;
}
// end section-6


const allKeys = Object.keys(localStorage);
const productKeys = allKeys.filter(key => key.startsWith('Product-'));
if (productKeys.length > 0) {
  const card_empty = document.querySelector(".section-3 .user-card-body .card-empty");
  card_empty.classList.remove("show");
  card_empty.classList.add("hidden");
  const card_non_empty = document.querySelector(".section-3 .user-card-body .card-non-empty");
  card_non_empty.classList.remove("hidden");
  card_non_empty.classList.add("show");
  fetchApi("http://localhost:3000/products")
    .then(products => {
      const cartItems = productKeys.map(key => {
        const productId = key.replace('Product-', '');
        const quantity = parseInt(localStorage.getItem(key));
        const product = products.find(p => p.id == productId);
        return {
          ...product,
          quantity: quantity
        };
      })
      const productTotal = ` (${cartItems.length} sản phẩm)`
      const col_feature_product = document.querySelector(".section-3 .column-feature .col-product");
      col_feature_product.innerHTML += productTotal;
      let htmls = "";
      cartItems.forEach(item => {
        const priceNumber = parseInt(item.price.replace(/,/g, ''));
        let totalPrice = priceNumber * item.quantity;
        totalPrice = totalPrice.toLocaleString('en-US') + ' VNĐ';
        htmls += `
        <div class="grid-products" id="Product-${item.id}">
          <div class="col-action">
            <input type="checkbox">
          </div>
          <div class="col-product">
            <img src="${item.thumbnail}" alt="${item.name}">
            <span>${item.name}</span> 
          </div>
          <div class="col-price">${item.price}</div>
          <div class="col-quantity">
            <button class="btn-minus">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="btn-plus">+</button>
          </div>
          <div class="col-total">${totalPrice}</div>
          <div class="col-del"><i class="fa-solid fa-trash-can"></i></div>
        </div>
      `
      })
      const column_products = document.querySelector(".section-3 .user-card-body .column-products");
      column_products.innerHTML = htmls;
      checkBoxEvent();
      quantityButtons();
      deleteEvent();
      btn_products();
    });
}


fetchApi("http://localhost:3000/banks")
  .then(data => {
    let htmls = "";
    let value = "";
    const name = document.querySelector("#fullName");
    const phoneNumber = document.querySelector("#phoneNumber");
    data.forEach(item => {
      htmls += `
      <li class="card-item" name="${item.name}" id="${item.id}">
        <img src="${item.logo}" alt="${item.shortName}">
        <div class="card-title">${item.name}</div>
        <div class="card-circle"></div>
      </li>
      `
      value += `
      <div class="bank-value hidden" id="bankData-${item.id}">
        <div class="bank-name-value">${item.shortName}</div>
        <div class="account-holder-value">Bright English</div>
        <div class="account-number-value">${item.accountNumber}</div>
        <div class="content-value">....</div>
      </div>`
    });
    const bank = document.querySelector("#bank")
    bank.innerHTML = htmls;
    const bankValue = document.querySelector(".grid-card-right")
    bankValue.innerHTML = value;
    selectBank();
  });



const form = document.querySelector("#personalForm");
form.addEventListener('submit', function (event) {
  event.preventDefault();
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('Email');
  const phoneNumber = document.getElementById('phoneNumber');
  const dateOfBirth = document.getElementById('dateOfBirth');
  const sex = document.getElementById('sex');

  let displayDate = '';
  if (dateOfBirth) {
    const date = new Date(dateOfBirth);
    displayDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

  localStorage.setItem(fullName.name, fullName.value);
  localStorage.setItem(email.name, email.value);
  localStorage.setItem(phoneNumber.name, phoneNumber.value);
  localStorage.setItem(dateOfBirth.name, dateOfBirth.value);
  localStorage.setItem(sex.name, sex.value);
  saveUserInfo();
  const col_right_UserInfo = document.querySelector(".section-4 .col-right");
  if (col_right_UserInfo.classList.contains("hidden")) {
    col_right_UserInfo.classList.remove("hidden");
    col_right_UserInfo.classList.add("show");
  }
})

const btn_UserInfo = document.querySelector(".section-4 .col-right button");
btn_UserInfo.addEventListener('click', () => {
  const section_5 = document.querySelector(".section-5");
  if (section_5.classList.contains("hidden")) {
    section_5.classList.remove("hidden");
    section_5.classList.add("show");
  }
  updateTimeLine(2);
})

setupTimelineScroll();